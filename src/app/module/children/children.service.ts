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
import { run_all_module } from 'src/app/helpers/aiapi';

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

// ─── Shared helpers ───────────────────────────────────────────────────────────

const hasModuleData = (dto: CreateChildDto | UpdateChildDto): boolean =>
  Boolean(
    dto.module1Observations?.length ||
    dto.module1Summary ||
    dto.module2Section1ParticipationAttention ||
    dto.module2Section2SensoryLearning ||
    dto.module2Section3InteractionSocial ||
    dto.module2Section4TaskHandling ||
    dto.module2Summary ||
    dto.module3HealthSelfCare ||
    dto.module3Language ||
    dto.module3Social ||
    dto.module3ScienceDramaticPlay ||
    dto.module3Arts ||
    dto.module3Summary,
  );

const triggerAllModuleAi = async (
  childModel: Model<ChildDocument>,
  whereConditions: object,
  child: Partial<Child> | null | undefined,
) => {
  if (!child) return null;
  try {
    const runId = await run_all_module({
      module1Observations: child.module1Observations ?? [],
      module1Summary: child.module1Summary ?? {},
      module2Section1ParticipationAttention:
        child.module2Section1ParticipationAttention,
      module2Section2SensoryLearning: child.module2Section2SensoryLearning,
      module2Section3InteractionSocial: child.module2Section3InteractionSocial,
      module2Section4TaskHandling: child.module2Section4TaskHandling,
      module2Summary: child.module2Summary,
      module3HealthSelfCare: child.module3HealthSelfCare,
      module3Language: child.module3Language,
      module3Social: child.module3Social,
      module3ScienceDramaticPlay: child.module3ScienceDramaticPlay,
      module3Arts: child.module3Arts,
      module3Summary: child.module3Summary,
    });
    const [personalityAndInterestId, learningStyleId, abilityAssessmentId] =
      runId;
    await childModel.findOneAndUpdate(whereConditions, {
      $set: {
        personality_and_interest: personalityAndInterestId,
        learning_style: learningStyleId,
        personal_ability: abilityAssessmentId,
        module1MainRunId: personalityAndInterestId,
        module2AiRunId: learningStyleId,
      },
    });
    return runId;
  } catch (err: any) {
    console.error('All-module AI workflow trigger failed:', err.message);
    return null;
  }
};

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async addChildrient(
    parentId: string,
    dto: CreateChildDto,
    profileFile?: Express.Multer.File,
    observationFiles?: Express.Multer.File[],
  ) {
    // 1. Parent check
    const parent = await this.userModel.findById(parentId);
    if (!parent) throw new HttpException('Parent not found', 404);

    // 2. Profile picture upload
    if (profileFile) {
      const uploaded = await fileUpload.uploadToCloudinary(profileFile);
      dto.profilePicture = uploaded.url;
    }

    // 3. Parse JSON fields + attach observation files
    parseChildMeasurements(dto);
    parseModuleFields(dto);
    const attachmentUrls = await uploadFilesToUrls(observationFiles);
    attachObservationFiles(dto, attachmentUrls);

    // 4. Auto-generate studentId
    dto.studentId = await this.generateStudentId();

    // 5. Save child
    const result = await this.childModel.create({
      ...normalizeChildWritePayload(dto),
      parentId: parent._id as Types.ObjectId,
    });

    // 6. Trigger AI (only if any module data exists)
    if (hasModuleData(dto)) {
      const runId = await triggerAllModuleAi(
        this.childModel,
        { _id: result._id },
        result,
      );
      if (runId) {
        result.personality_and_interest = runId[0];
        result.learning_style = runId[1];
        result.personal_ability = runId[2];
      }
    }
    return result;
  }

  private async generateStudentId(): Promise<string> {
    const last = await this.childModel
      .findOne({})
      .sort({ createdAt: -1 })
      .select('studentId');
    const lastNum = last?.studentId
      ? parseInt(last.studentId.replace('STU-', ''), 10)
      : 1000;
    return `STU-${lastNum + 1}`;
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

    // ✅ আগে parse করো, তারপর file attach করো (addChildrient এর সাথে consistent)
    parseChildMeasurements(updateChildDto);
    parseModuleFields(updateChildDto);

    const attachmentUrls = await uploadFilesToUrls(observationAttachments);
    attachObservationFiles(
      updateChildDto,
      attachmentUrls,
      child.module1Observations,
    );

    const normalizedUpdatePayload = normalizeChildWritePayload(updateChildDto);

    const result = await this.childModel.findOneAndUpdate(
      whereConditions,
      {
        $set: normalizedUpdatePayload as UpdateQuery<Child>,
        $unset: { 'height._id': 1, 'weight._id': 1 },
      },
      { new: true },
    );

    // ── Single All-Module AI call ────────────────────────────────────────────
    if (hasModuleData(updateChildDto)) {
      const runId = await triggerAllModuleAi(
        this.childModel,
        whereConditions,
        result,
      );
      if (runId && result) {
        result.personality_and_interest = runId[0];
        result.learning_style = runId[1];
        result.personal_ability = runId[2];
      }
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
