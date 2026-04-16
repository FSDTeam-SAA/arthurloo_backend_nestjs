import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview (Total Users, Active, Suspended, AI Chat Sessions)',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async dashboardOverview() {
    const result = await this.dashboardService.dashboardOverview();
    return {
      message: 'Dashboard overview fetched successfully',
      data: result,
    };
  }

  @Get('user-activity')
  @ApiOperation({
    summary: 'Get monthly user activity over time',
  })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2026 })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async userActivity(@Query('year') year?: string) {
    const result = await this.dashboardService.userActivity(
      year ? parseInt(year, 10) : undefined,
    );
    return {
      message: 'User activity fetched successfully',
      data: result,
    };
  }
}
