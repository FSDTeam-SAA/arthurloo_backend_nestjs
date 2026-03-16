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

// ─── Parse simple object fields (height, weight) ─────────────────────────────

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
      payload[key] = rest as typeof payload[typeof key];
      continue;
    }

    payload[key] = parsedValue as typeof payload[typeof key];
  }
};

// ─── Parse nested module JSON fields sent as strings (multipart/form-data) ───

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
  // Parse object fields
  for (const key of MODULE_OBJECT_FIELDS) {
    const value = (payload as any)[key];
    if (!value) continue;
    if (typeof value === 'string') {
      try {
        (payload as any)[key] = JSON.parse(value);
      } catch {
        // leave as-is if parse fails
      }
    }
  }

  // Parse array fields
  for (const key of MODULE_ARRAY_FIELDS) {
    const value = (payload as any)[key];
    if (!value) continue;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        (payload as any)[key] = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // leave as-is
      }
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
  const normalizedPayload = {
    ...payload,
    datoOfBirth: toDate(payload.datoOfBirth),
    startServiceDate: toDate(payload.startServiceDate),
    module1Observations: payload.module1Observations?.map((entry) => ({
      ...entry,
      observationDate: toDate(entry.observationDate),
    })),
  };

  return normalizedPayload as unknown as Partial<Child>;
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

  const observations =
    payload.module1Observations?.length
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

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

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

    const attachmentUrls = await uploadFilesToUrls(observationAttachments);
    attachObservationFiles(createChildDto, attachmentUrls);

    // Auto-generate studentId
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

    parseChildMeasurements(createChildDto);
    parseModuleFields(createChildDto);

    const childPayload = {
      ...normalizeChildWritePayload(createChildDto),
      parentId: parent._id as Types.ObjectId,
    };

    const result = await this.childModel.create(childPayload);

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
    attachObservationFiles(updateChildDto, attachmentUrls, child.module1Observations);

    parseChildMeasurements(updateChildDto);
    parseModuleFields(updateChildDto);

    const normalizedUpdatePayload = normalizeChildWritePayload(updateChildDto);

    const result = await this.childModel.findOneAndUpdate(
      whereConditions,
      {
        $set: normalizedUpdatePayload as UpdateQuery<Child>,
        $unset: {
          'height._id': 1,
          'weight._id': 1,
        },
      },
      { new: true },
    );

    return result;
  }

  async deleteChildren(id: string, parentId?: string) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const child = await this.childModel.findOne(whereConditions);
    if (!child) throw new HttpException('Child not found', 404);

    return this.childModel.findOneAndDelete(whereConditions);
  }
}
