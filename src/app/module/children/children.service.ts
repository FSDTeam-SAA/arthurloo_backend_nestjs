import { HttpException, Injectable } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Child, ChildDocument } from './entities/child.entity';
import { Model, Types, UpdateQuery } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';
import {
  learning_style_data,
  personality_and_interest,
} from 'src/app/helpers/aiapi';

const childSearchAbleFields = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'schoolName',
  'class',
  'nickName',
  'primaryLanguage',
  'homeLanguage',
  'serviceStage',
  'currentPlanType',
  'topPriority',
  'studentId',
];

const parseChildMeasurements = (payload: CreateChildDto | UpdateChildDto) => {
  for (const key of ['height', 'weight'] as const) {
    const value = payload[key];
    if (!value) continue;
    const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
    if (
      parsedValue &&
      typeof parsedValue === 'object' &&
      !Array.isArray(parsedValue)
    ) {
      const { _id, ...rest } = parsedValue as Record<string, unknown>;
      payload[key] = rest as (typeof payload)[typeof key];
      continue;
    }
    payload[key] = parsedValue as (typeof payload)[typeof key];
  }
};

const MODULE_OBJECT_FIELDS = [
  'module1Summary',
  'module2Section1ParticipationAttention',
  'module2Section2SensoryLearning',
  'module2Section3InteractionSocial',
  'module2Section4TaskHandling',
  'module2Summary',
  'module3HealthSelfCare',
  'module3Language',
  'module3Social',
  'module3ScienceDramaticPlay',
  'module3Arts',
  'module3Summary',
] as const;

const MODULE_ARRAY_FIELDS = ['module1Observations'] as const;

const parseModuleFields = (payload: CreateChildDto | UpdateChildDto) => {
  for (const key of MODULE_OBJECT_FIELDS) {
    const value = (payload as any)[key];
    if (!value) continue;
    if (typeof value === 'string') {
      try {
        (payload as any)[key] = JSON.parse(value);
      } catch {}
    }
  }
  for (const key of MODULE_ARRAY_FIELDS) {
    const value = (payload as any)[key];
    if (!value) continue;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        (payload as any)[key] = Array.isArray(parsed) ? parsed : [parsed];
      } catch {}
    }
  }
};

const toDate = (value?: string | Date) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

// const normalizeChildWritePayload = (
//   payload: CreateChildDto | UpdateChildDto,
// ): Partial<Child> => {
//   const normalizedPayload = {
//     ...payload,
//     datoOfBirth: toDate(payload.datoOfBirth),
//     startServiceDate: toDate(payload.startServiceDate),
//     module1Observations: payload.module1Observations?.map((entry) => ({
//       ...entry,
//       observationDate: toDate(entry.observationDate),
//     })),
//   };
//   return normalizedPayload as unknown as Partial<Child>;
// };

const normalizeChildWritePayload = (
  payload: CreateChildDto | UpdateChildDto,
): Partial<Child> => {
  // class instance → plain object, নাহলে spread এ module fields হারিয়ে যায়
  const plain = JSON.parse(JSON.stringify(payload));

  return {
    ...plain,
    datoOfBirth: toDate(payload.datoOfBirth),
    startServiceDate: toDate(payload.startServiceDate),
    // undefined হলে override করবে না
    ...(payload.module1Observations !== undefined && {
      module1Observations: payload.module1Observations.map((entry) => ({
        ...entry,
        observationDate: toDate(entry.observationDate),
      })),
    }),
  } as unknown as Partial<Child>;
};

const uploadFilesToUrls = async (files?: Express.Multer.File[]) => {
  if (!files?.length) return [];
  const uploadedFiles = await Promise.all(
    files.map((file) => fileUpload.uploadToCloudinary(file)),
  );
  return uploadedFiles.map((file) => file.url);
};

const attachObservationFiles = (
  payload: CreateChildDto | UpdateChildDto,
  attachmentUrls: string[],
  existingObservations?: Child['module1Observations'],
) => {
  if (!attachmentUrls.length) return;
  const observations = payload.module1Observations?.length
    ? payload.module1Observations.map((entry) => ({ ...entry }))
    : existingObservations?.length
      ? existingObservations.map((entry) => ({
          ...entry,
          observationDate:
            entry.observationDate instanceof Date
              ? entry.observationDate.toISOString()
              : entry.observationDate,
        }))
      : [{}];

  const firstObservation = observations[0] ?? {};
  const existingAttachments = Array.isArray(firstObservation.attachments)
    ? firstObservation.attachments
    : [];
  observations[0] = {
    ...firstObservation,
    attachments: [...existingAttachments, ...attachmentUrls],
  };
  payload.module1Observations = observations;
};

// ─── Shared AI trigger helper ─────────────────────────────────────────────────

const triggerModule1Ai = async (
  childModel: Model<ChildDocument>,
  childId: any,
  observations: any[],
  summary: any,
) => {
  try {
    const runId = await personality_and_interest(
      observations ?? [],
      summary ?? {},
    );
    await childModel.findByIdAndUpdate(childId, {
      $set: { module1MainRunId: runId },
    });
    return runId;
  } catch (err: any) {
    console.error('Module1 AI workflow trigger failed:', err.message);
    return null;
  }
};

const triggerModule2Ai = async (
  childModel: Model<ChildDocument>,
  whereConditions: object,
  section1: any,
  section2: any,
  section3: any,
  section4: any,
  summary: any,
) => {
  try {
    const runId = await learning_style_data(
      section1,
      section2,
      section3,
      section4,
      summary,
    );
    await childModel.findOneAndUpdate(whereConditions, {
      $set: { module2AiRunId: runId },
    });
    return runId;
  } catch (err: any) {
    console.error('Module2 AI workflow trigger failed:', err.message);
    return null;
  }
};

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // async addChildrient(
  //   parentId: string,
  //   createChildDto: CreateChildDto,
  //   file?: Express.Multer.File,
  //   observationAttachments?: Express.Multer.File[],
  // ) {
  //   const parent = await this.userModel.findById(parentId);
  //   if (!parent) throw new HttpException('Parent not found', 404);

  //   if (file) {
  //     const uploadedFile = await fileUpload.uploadToCloudinary(file);
  //     createChildDto.profilePicture = uploadedFile.url;
  //   }

  //   const attachmentUrls = await uploadFilesToUrls(observationAttachments);
  //   attachObservationFiles(createChildDto, attachmentUrls);

  //   const lastChild = await this.childModel
  //     .findOne({})
  //     .sort({ createdAt: -1 })
  //     .select('studentId');

  //   let nextId = 1001;
  //   if (lastChild?.studentId) {
  //     const numericPart = parseInt(lastChild.studentId.replace('STU-', ''), 10);
  //     nextId = numericPart + 1;
  //   }
  //   createChildDto.studentId = `STU-${nextId}`;

  //   parseChildMeasurements(createChildDto);
  //   parseModuleFields(createChildDto);

  //   const childPayload = {
  //     ...normalizeChildWritePayload(createChildDto),
  //     parentId: parent._id as Types.ObjectId,
  //   };

  //   const result = await this.childModel.create(childPayload);

  //   // ── Module 1 AI call ──────────────────────────────────────────────────────
  //   if (createChildDto.module1Observations?.length || createChildDto.module1Summary) {
  //     const runId = await triggerModule1Ai(
  //       this.childModel,
  //       result._id,
  //       result.module1Observations,
  //       result.module1Summary,
  //     );
  //     if (runId) result.module1MainRunId = runId;
  //   }

  //   // ── Module 2 AI call ──────────────────────────────────────────────────────
  //   if (
  //     createChildDto.module2Section1ParticipationAttention ||  // ✅ createChildDto (bug fix)
  //     createChildDto.module2Section2SensoryLearning ||
  //     createChildDto.module2Section3InteractionSocial ||
  //     createChildDto.module2Section4TaskHandling ||
  //     createChildDto.module2Summary
  //   ) {
  //     const runId = await triggerModule2Ai(
  //       this.childModel,
  //       { _id: result._id },
  //       result.module2Section1ParticipationAttention,
  //       result.module2Section2SensoryLearning,
  //       result.module2Section3InteractionSocial,
  //       result.module2Section4TaskHandling,
  //       result.module2Summary,
  //     );
  //     if (runId) result.module2AiRunId = runId;
  //   }

  //   return result;
  // }

  async addChildrient(
    parentId: string,
    createChildDto: CreateChildDto,
    file?: Express.Multer.File,
    observationAttachments?: Express.Multer.File[],
  ) {
    const parent = await this.userModel.findById(parentId);
    if (!parent) throw new HttpException('Parent not found', 404);

    if (file) {
      const uploadedFile = await fileUpload.uploadToCloudinary(file);
      createChildDto.profilePicture = uploadedFile.url;
    }

    // ✅ আগে parse করো, তারপর file attach করো
    parseChildMeasurements(createChildDto);
    parseModuleFields(createChildDto);

    const attachmentUrls = await uploadFilesToUrls(observationAttachments);
    attachObservationFiles(createChildDto, attachmentUrls);

    const lastChild = await this.childModel
      .findOne({})
      .sort({ createdAt: -1 })
      .select('studentId');

    let nextId = 1001;
    if (lastChild?.studentId) {
      const numericPart = parseInt(lastChild.studentId.replace('STU-', ''), 10);
      nextId = numericPart + 1;
    }
    createChildDto.studentId = `STU-${nextId}`;

    const childPayload = {
      ...normalizeChildWritePayload(createChildDto),
      parentId: parent._id as Types.ObjectId,
    };

    const result = await this.childModel.create(childPayload);

    // Module 1 AI call
    if (
      createChildDto.module1Observations?.length ||
      createChildDto.module1Summary
    ) {
      const runId = await triggerModule1Ai(
        this.childModel,
        result._id,
        result.module1Observations,
        result.module1Summary,
      );
      if (runId) result.module1MainRunId = runId;
    }

    // Module 2 AI call
    if (
      createChildDto.module2Section1ParticipationAttention ||
      createChildDto.module2Section2SensoryLearning ||
      createChildDto.module2Section3InteractionSocial ||
      createChildDto.module2Section4TaskHandling ||
      createChildDto.module2Summary
    ) {
      const runId = await triggerModule2Ai(
        this.childModel,
        { _id: result._id },
        result.module2Section1ParticipationAttention,
        result.module2Section2SensoryLearning,
        result.module2Section3InteractionSocial,
        result.module2Section4TaskHandling,
        result.module2Summary,
      );
      if (runId) result.module2AiRunId = runId;
    }

    return result;
  }

  async getAllChildren(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, childSearchAbleFields);
    const result = await this.childModel
      .find(whereConditions)
      .populate('parentId')
      .sort({ [sortBy]: sortOrder } as any)
      .skip(skip)
      .limit(limit);
    const total = await this.childModel.countDocuments(whereConditions);
    return { meta: { total, page, limit }, data: result };
  }

  async getSingleChildren(id: string, parentId?: string) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const result = await this.childModel
      .findOne(whereConditions)
      .populate('parentId');
    if (!result) throw new HttpException('Child not found', 404);
    return result;
  }

  async myAllChildren(
    parentId: string,
    params: IFilterParams,
    options: IOptions,
  ) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(
      params,
      childSearchAbleFields,
      { parentId },
    );
    const result = await this.childModel
      .find(whereConditions)
      .populate('parentId')
      .sort({ [sortBy]: sortOrder } as any)
      .skip(skip)
      .limit(limit);
    const total = await this.childModel.countDocuments(whereConditions);
    return { meta: { total, page, limit }, data: result };
  }

  async updateChildren(
    id: string,
    updateChildDto: UpdateChildDto,
    parentId?: string,
    file?: Express.Multer.File,
    observationAttachments?: Express.Multer.File[],
  ) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const child = await this.childModel.findOne(whereConditions);
    if (!child) throw new HttpException('Child not found', 404);

    if (file) {
      const uploadedFile = await fileUpload.uploadToCloudinary(file);
      updateChildDto.profilePicture = uploadedFile.url;
    }

    const attachmentUrls = await uploadFilesToUrls(observationAttachments);
    attachObservationFiles(
      updateChildDto,
      attachmentUrls,
      child.module1Observations,
    );

    parseChildMeasurements(updateChildDto);
    parseModuleFields(updateChildDto);

    const normalizedUpdatePayload = normalizeChildWritePayload(updateChildDto);

    const result = await this.childModel.findOneAndUpdate(
      whereConditions,
      {
        $set: normalizedUpdatePayload as UpdateQuery<Child>,
        $unset: { 'height._id': 1, 'weight._id': 1 },
      },
      { new: true },
    );

    // ── Module 1 AI call ──────────────────────────────────────────────────────
    if (
      updateChildDto.module1Observations?.length ||
      updateChildDto.module1Summary
    ) {
      const runId = await triggerModule1Ai(
        this.childModel,
        result?._id,
        result?.module1Observations ?? [],
        result?.module1Summary ?? {},
      );
      if (runId && result) result.module1MainRunId = runId;
    }

    // ── Module 2 AI call ──────────────────────────────────────────────────────
    if (
      updateChildDto.module2Section1ParticipationAttention ||
      updateChildDto.module2Section2SensoryLearning ||
      updateChildDto.module2Section3InteractionSocial ||
      updateChildDto.module2Section4TaskHandling ||
      updateChildDto.module2Summary
    ) {
      const runId = await triggerModule2Ai(
        this.childModel,
        whereConditions,
        result?.module2Section1ParticipationAttention,
        result?.module2Section2SensoryLearning,
        result?.module2Section3InteractionSocial,
        result?.module2Section4TaskHandling,
        result?.module2Summary,
      );
      if (runId && result) result.module2AiRunId = runId;
    }

    return result;
  }

  async deleteChildren(id: string, parentId?: string) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const child = await this.childModel.findOne(whereConditions);
    if (!child) throw new HttpException('Child not found', 404);
    return this.childModel.findOneAndDelete(whereConditions);
  }
}
