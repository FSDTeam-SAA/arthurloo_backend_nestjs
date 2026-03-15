import { HttpException, Injectable } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Child, ChildDocument } from './entities/child.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private buildChildWhereConditions(
    params: IFilterParams,
    extraConditions: Record<string, unknown> = {},
  ) {
    const { searchTerm, ...filterData } = params;
    const andConditions: any[] = [];
    const searchAbleFields = [
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

    if (searchTerm) {
      andConditions.push({
        $or: searchAbleFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }

    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        $and: Object.entries(filterData).map(([key, value]) => ({
          [key]: value,
        })),
      });
    }

    if (Object.keys(extraConditions).length > 0) {
      andConditions.push(extraConditions);
    }

    return andConditions.length > 0 ? { $and: andConditions } : {};
  }

  async addChildrient(
    parentId: string,
    createChildDto: CreateChildDto,
    file?: Express.Multer.File,
  ) {
    const parent = await this.userModel.findById(parentId);
    if (!parent) throw new HttpException('Parent not found', 404);

    if (file) {
      const uploadedFile = await fileUpload.uploadToCloudinary(file);
      createChildDto.profilePicture = uploadedFile.url;
    }
    // Find the last studentId in DB
    const lastChild = await this.childModel
      .findOne({})
      .sort({ createdAt: -1 })
      .select('studentId');

    let nextId = 1001; // starting number
    if (lastChild && lastChild.studentId) {
      const numericPart = parseInt(lastChild.studentId.replace('STU-', ''), 10);
      nextId = numericPart + 1;
    }

    createChildDto.studentId = `STU-${nextId}`;

    if (typeof createChildDto.height === 'string') {
      createChildDto.height = JSON.parse(createChildDto.height);
    }
    if (typeof createChildDto.weight === 'string') {
      createChildDto.weight = JSON.parse(createChildDto.weight);
    }
    const result = await this.childModel.create({
      ...createChildDto,
      parentId: parent._id,
    });

    return result;
  }

  async getAllChildren(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = this.buildChildWhereConditions(params);

    const result = await this.childModel
      .find(whereConditions)
      .populate('parentId')
      .sort({ [sortBy]: sortOrder } as any)
      .skip(skip)
      .limit(limit);

    const total = await this.childModel.countDocuments(whereConditions);

    return {
      meta: {
        total,
        page,
        limit,
      },
      data: result,
    };
  }

  async getSingleChildren(id: string, parentId?: string) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const result = await this.childModel
      .findOne(whereConditions)
      .populate('parentId');
    if (!result) {
      throw new HttpException('Child not found', 404);
    }
    return result;
  }

  async myAllChildren(
    parentId: string,
    params: IFilterParams,
    options: IOptions,
  ) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = this.buildChildWhereConditions(params, { parentId });

    const result = await this.childModel
      .find(whereConditions)
      .populate('parentId')
      .sort({ [sortBy]: sortOrder } as any)
      .skip(skip)
      .limit(limit);

    const total = await this.childModel.countDocuments(whereConditions);

    return {
      meta: {
        total,
        page,
        limit,
      },
      data: result,
    };
  }

  async updateChildren(
    id: string,
    updateChildDto: UpdateChildDto,
    parentId?: string,
    file?: Express.Multer.File,
  ) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const child = await this.childModel.findOne(whereConditions);
    if (!child) {
      throw new HttpException('Child not found', 404);
    }

    if (file) {
      const uploadedFile = await fileUpload.uploadToCloudinary(file);
      updateChildDto.profilePicture = uploadedFile.url;
    }

    if (typeof updateChildDto.height === 'string') {
      updateChildDto.height = JSON.parse(updateChildDto.height);
    }
    if (typeof updateChildDto.weight === 'string') {
      updateChildDto.weight = JSON.parse(updateChildDto.weight);
    }

    const result = await this.childModel.findOneAndUpdate(
      whereConditions,
      updateChildDto,
      {
        new: true,
      },
    );

    return result;
  }

  async deleteChildren(id: string, parentId?: string) {
    const whereConditions = parentId ? { _id: id, parentId } : { _id: id };
    const child = await this.childModel.findOne(whereConditions);
    if (!child) {
      throw new HttpException('Child not found', 404);
    }

    const result = await this.childModel.findOneAndDelete(whereConditions);
    return result;
  }
}
