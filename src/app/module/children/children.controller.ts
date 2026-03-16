import {
  Delete,
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Req,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@ApiTags('Children')
@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  // ── POST /children ─────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Create a child profile (parent only)' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateChildDto })
  @UseGuards(AuthGuard('parent'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePicture', maxCount: 1 },
        { name: 'module1ObservationAttachments', maxCount: 10 },
      ],
      fileUpload.uploadConfig,
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  async addChildrient(
    @Req() req: Request,
    @Body() createChildDto: CreateChildDto,
    @UploadedFiles()
    files?: {
      profilePicture?: Express.Multer.File[];
      module1ObservationAttachments?: Express.Multer.File[];
    },
  ) {
    const parentId = req.user!.id;
    const result = await this.childrenService.addChildrient(
      parentId,
      createChildDto,
      files?.profilePicture?.[0],
      files?.module1ObservationAttachments,
    );
    return { message: 'Child created successfully', data: result };
  }

  // ── GET /children ──────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get all children (admin / teacher)' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'gender', required: false, type: String })
  @ApiQuery({ name: 'schoolName', required: false, type: String })
  @ApiQuery({ name: 'class', required: false, type: String })
  @ApiQuery({ name: 'nickName', required: false, type: String })
  @ApiQuery({ name: 'primaryLanguage', required: false, type: String })
  @ApiQuery({ name: 'homeLanguage', required: false, type: String })
  @ApiQuery({ name: 'serviceStage', required: false, type: String })
  @ApiQuery({ name: 'currentPlanType', required: false, type: String })
  @ApiQuery({ name: 'topPriority', required: false, type: String })
  @ApiQuery({ name: 'studentId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @UseGuards(AuthGuard('admin', 'teacher'))
  @HttpCode(HttpStatus.OK)
  async getAllChildren(@Req() req: Request) {
    const params = pick(req.query, [
      'searchTerm',
      'firstName',
      'lastName',
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
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.childrenService.getAllChildren(params, options);
    return { message: 'Children fetched successfully', meta: result.meta, data: result.data };
  }

  // ── GET /children/my-children ──────────────────────────────────────────────
  @Get('my-children')
  @ApiOperation({ summary: 'Get all children of the logged-in parent' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'gender', required: false, type: String })
  @ApiQuery({ name: 'schoolName', required: false, type: String })
  @ApiQuery({ name: 'class', required: false, type: String })
  @ApiQuery({ name: 'studentId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @UseGuards(AuthGuard('parent'))
  @HttpCode(HttpStatus.OK)
  async myAllChildren(@Req() req: Request) {
    const params = pick(req.query, [
      'searchTerm',
      'firstName',
      'lastName',
      'gender',
      'schoolName',
      'class',
      'studentId',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.childrenService.myAllChildren(
      req.user!.id,
      params,
      options,
    );
    return { message: 'My children fetched successfully', meta: result.meta, data: result.data };
  }

  // ── GET /children/:id ──────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get single child by id' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin', 'teacher', 'parent'))
  @HttpCode(HttpStatus.OK)
  async getSingleChildren(@Param('id') id: string, @Req() req: Request) {
    const parentId = req.user?.role === 'parent' ? req.user.id : undefined;
    const result = await this.childrenService.getSingleChildren(id, parentId);
    return { message: 'Child fetched successfully', data: result };
  }

  // ── PUT /children/:id ──────────────────────────────────────────────────────
  @Put(':id')
  @ApiOperation({ summary: 'Update child by id (admin / teacher / parent)' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateChildDto })
  @UseGuards(AuthGuard('admin', 'teacher', 'parent'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePicture', maxCount: 1 },
        { name: 'module1ObservationAttachments', maxCount: 10 },
      ],
      fileUpload.uploadConfig,
    ),
  )
  @HttpCode(HttpStatus.OK)
  async updateChildren(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateChildDto: UpdateChildDto,
    @UploadedFiles()
    files?: {
      profilePicture?: Express.Multer.File[];
      module1ObservationAttachments?: Express.Multer.File[];
    },
  ) {
    // Parents can only update their own child; admin & teacher have no restriction
    const parentId = req.user?.role === 'parent' ? req.user.id : undefined;

    const result = await this.childrenService.updateChildren(
      id,
      updateChildDto,
      parentId,
      files?.profilePicture?.[0],
      files?.module1ObservationAttachments,
    );
    return { message: 'Child updated successfully', data: result };
  }

  // ── DELETE /children/:id ───────────────────────────────────────────────────
  @Delete(':id')
  @ApiOperation({ summary: 'Delete child by id (admin / parent)' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin', 'parent'))
  @HttpCode(HttpStatus.OK)
  async deleteChildren(@Param('id') id: string, @Req() req: Request) {
    const parentId = req.user?.role === 'parent' ? req.user.id : undefined;
    const result = await this.childrenService.deleteChildren(id, parentId);
    return { message: 'Child deleted successfully', data: result };
  }
}
