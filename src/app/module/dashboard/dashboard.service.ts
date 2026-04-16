import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import {
  ChildInsight,
  ChildInsightDocument,
} from '../child_insights/entities/child_insight.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ChildInsight.name)
    private readonly childInsightModel: Model<ChildInsightDocument>,
  ) {}

  // API 1: Dashboard stats overview
  async dashboardOverview() {
    const [totalUsers, totalActiveUsers, totalSuspendedUsers, aiChatSessions] =
      await Promise.all([
        this.userModel.countDocuments(),
        this.userModel.countDocuments({ status: 'active' }),
        this.userModel.countDocuments({ status: 'block' }),
        this.childInsightModel.countDocuments(),
      ]);

    return {
      totalUsers,
      totalActiveUsers,
      totalSuspendedUsers,
      aiChatSessions,
    };
  }

  // API 2: User activity over time (monthly)
  async userActivity(year?: number) {
    const targetYear = year || new Date().getFullYear();

    const monthlyData = await this.userModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${targetYear}-01-01`),
            $lt: new Date(`${targetYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map months 1-12, fill missing months with 0
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const activity = monthNames.map((month, index) => {
      const found = monthlyData.find((m) => m._id === index + 1);
      return {
        month,
        count: found ? found.count : 0,
      };
    });

    return {
      year: targetYear,
      activity,
    };
  }
}
