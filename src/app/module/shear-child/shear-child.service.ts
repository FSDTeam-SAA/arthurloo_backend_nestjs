import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
import sendMailer from 'src/app/helpers/sendMailer';

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
    const shearChild = await this.shearChildModel.create({
      teacherId: teacher._id,
      childId: child._id,
      parentId: parent._id,
    });

    await sendMailer(
      teacher.email,
      'New Child Sharing Request',
      `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#4CAF50; padding:20px; text-align:center; color:white;">
        <h2 style="margin:0;">Child Sharing Request</h2>
      </div>

      <!-- Body -->
      <div style="padding:20px;">
        <p style="font-size:16px;">Dear <strong>${teacher.firstName}</strong>,</p>

        <p style="font-size:15px; color:#555;">
          You have received a request to access a child's profile.
        </p>

        <!-- Child Info Card -->
        <div style="border:1px solid #eee; border-radius:8px; padding:15px; margin:20px 0;">
          <h3 style="margin-top:0; color:#333;">👶 Child Information</h3>
          
          <p><strong>Name:</strong> ${child.firstName} ${child.lastName}</p>
          <p><strong>Student ID:</strong> ${child.studentId}</p>
          <p><strong>Class:</strong> ${child.class}</p>
          <p><strong>Age:</strong> ${child.age}</p>
          <p><strong>Gender:</strong> ${child.gender}</p>
          
          ${
            child.profilePicture
              ? `<img src="${child.profilePicture}" alt="Child Image" style="width:100px; border-radius:8px; margin-top:10px;" />`
              : ''
          }
        </div>

        <!-- Parent Info -->
        <div style="margin-bottom:20px;">
          <h4 style="margin-bottom:5px;">👨‍👩‍👧 Parent Information</h4>
          <p style="margin:0;">
            ${parent.firstName} ${parent.lastName}
          </p>
        </div>     
      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} Your App. All rights reserved.
      </div>
    </div>
  </div>
  `,
    );
    return shearChild;
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
      .sort({ [sortBy]: sortOrder } as any)
      .populate({
        path: 'childId',
        select: 'firstName lastName email',
      })
      .populate({
        path: 'parentId',
        select: 'firstName lastName email profileImage',
      })
      .populate({
        path: 'teacherId',
        select: 'firstName lastName email profileImage',
      });

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
    const result = await this.shearChildModel
      .findById(id)
      .populate({
        path: 'childId',
        select: 'firstName lastName email',
      })
      .populate({
        path: 'parentId',
        select: 'firstName lastName email profileImage',
      })
      .populate({
        path: 'teacherId',
        select: 'firstName lastName email profileImage',
      });
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

  // ne need to implement this
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
    // send email to parent
    return result;
  }

  async deleteShearChild(id: string) {
    const result = await this.shearChildModel.findByIdAndDelete(id);
    if (!result) {
      throw new BadRequestException('Shear child not found');
    }
    return result;
  }

  async addStudentToShearChild(teacherId: string, studentId: string) {
    const teacher = await this.userModel.findById(teacherId);
    if (!teacher) throw new BadRequestException('Teacher not found');

    const student = await this.childModel.findOne({ studentId });
    if (!student) throw new BadRequestException('Student not found');

    const existingShearChild = await this.shearChildModel.findOne({
      teacherId: teacher._id,
      childId: student._id,
    });
    if (!existingShearChild) {
      throw new BadRequestException('Not authorized to add this student');
    }

    existingShearChild.status = 'approved';
    await existingShearChild.save();

    return existingShearChild;
  }
}
