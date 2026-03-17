import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShearChildDto } from './dto/create-shear-child.dto';
import { UpdateShearChildDto } from './dto/update-shear-child.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ShearChild, ShearChildDocument } from './entities/shear-child.entity';
import { Model } from 'mongoose';
import { Child, ChildDocument } from '../children/entities/child.entity';
import { User, UserDocument } from '../user/entities/user.entity';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class ShearChildService {
  constructor(
    @InjectModel(ShearChild.name)
    private readonly shearChildModel: Model<ShearChildDocument>,
    @InjectModel(Child.name)
    private readonly childModel: Model<ChildDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createShearChild(
    parentId: string,
    createShearChildDto: CreateShearChildDto,
  ) {
    const parent = await this.userModel.findById(parentId);
    if (!parent) {
      throw new BadRequestException('Parent not found');
    }
    const { teacherId, childId } = createShearChildDto;
    if (!teacherId) {
      throw new BadRequestException('Teacher ID is required');
    }
    if (!childId) {
      throw new BadRequestException('Child ID is required');
    }
    const teacher = await this.userModel.findById(teacherId);
    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }
    const child = await this.childModel.findOne({ studentId: childId });
    if (!child) {
      throw new BadRequestException('Child not found');
    }
    const shearChild = new this.shearChildModel({
      teacherId: teacher._id,
      childId: child._id,
      parentId: parent._id,
    });
    return await shearChild.save();
  }

  async getAllShearChild(
    teactherId: string,
    params: IFilterParams,
    options: IOptions,
  ) {
    const teacher = await this.userModel.findById(teactherId);
    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);

    const searchFields = ['firstName', 'lastName', 'email'];

    const whereConditions = buildWhereConditions(params, searchFields, {
      teacherId: teacher._id,
    });

    const result = await this.shearChildModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder } as any);

    const total = await this.shearChildModel.countDocuments(whereConditions);

    return {
      data: result,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getSingleShearChild(id: string) {
    const result = await this.shearChildModel.findById(id);
    if (!result) {
      throw new BadRequestException('Shear child not found');
    }
    return result;
  }

  async updateShearChild(id: string, updateShearChildDto: UpdateShearChildDto) {
    const result = await this.shearChildModel.findByIdAndUpdate(
      id,
      updateShearChildDto,
      {
        new: true,
      },
    );
    if (!result) {
      throw new BadRequestException('Shear child not found');
    }
    return result;
  }

  async updateShearChildStatus(id: string, status: string) {
    const result = await this.shearChildModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    );
    if (!result) {
      throw new BadRequestException('Shear child not found');
    }
    return result;
  }

  async deleteShearChild(id: string) {
    const result = await this.shearChildModel.findByIdAndDelete(id);
    if (!result) {
      throw new BadRequestException('Shear child not found');
    }
    return result;
  }
}
