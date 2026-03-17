import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ShearChildService } from './shear-child.service';
import { CreateShearChildDto, UpdateShearChildStatusDto } from './dto/create-shear-child.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@ApiTags('Shear Child')
@Controller('shear-child')
export class ShearChildController {
  constructor(private readonly shearChildService: ShearChildService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new shear child',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('parent'))
  @ApiBody({ type: CreateShearChildDto })
  @HttpCode(HttpStatus.CREATED)
  async createShearChild(
    @Req() req: Request,
    @Body() createShearChildDto: CreateShearChildDto,
  ) {
    const result = await this.shearChildService.createShearChild(
      req.user!.id,
      createShearChildDto,
    );
    return {
      message: 'Shear child created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all shear children',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('teacher'))
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    example: '',
    description: 'Search by product name, description, whatWillYouGet, or size',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    example: '',
    description: 'Filter by status value',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number. Default is 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page. Default is 10',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: '',
    description: 'Sort field. Default is createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: '',
    description: 'Sort order. Default is desc',
  })
  @HttpCode(HttpStatus.OK)
  async getAllShearChild(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'firstName',
      'lastName',
      'email',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.shearChildService.getAllShearChild(
      req.user!.id,
      filters,
      options,
    );
    return {
      message: 'Shear children fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single shear child',
  })
  @HttpCode(HttpStatus.OK)
  async getSingleShearChild(@Param('id') id: string) {
    const result = await this.shearChildService.getSingleShearChild(id);
    return {
      message: 'Shear child fetched successfully',
      data: result,
    };
  }

  

  @Put(':id/status')
  @ApiOperation({
    summary: 'Update a single shear child status',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('teacher'))
  @ApiBody({ type: UpdateShearChildStatusDto })
  @HttpCode(HttpStatus.OK)
  async updateShearChildStatus(
    @Param('id') id: string,
    @Body() updateShearChildDto: UpdateShearChildStatusDto,
  ) {
    const result = await this.shearChildService.updateShearChildStatus(
      id,
      updateShearChildDto.status,
    );
    return {
      message: 'Shear child updated successfully',
      data: result,
    };
  }
}
