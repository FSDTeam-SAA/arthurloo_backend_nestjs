import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChildInsightsService } from './child_insights.service';
import { CreateChildInsightDto } from './dto/create-child_insight.dto';
import { UpdateChildInsightDto } from './dto/update-child_insight.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('child-insights')
@Controller('child-insights')
export class ChildInsightsController {
  constructor(private readonly childInsightsService: ChildInsightsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get child insight' })
  @HttpCode(HttpStatus.OK)
  async getChildInsight(@Param('id') id: string) {
    return this.childInsightsService.chatGetChildInsight(id);
  }
}
