import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ChildInsightsService } from './child_insights.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
