import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async dashboardOverview() {
    const totalUsers = await this.userModel.countDocuments();
    const totalActiveUsers = await this.userModel.countDocuments({
      status: 'active',
    });
    const totalSuspendedUsers = await this.userModel.countDocuments({
      status: 'block',
    });
    const aiChatSessions = 0;
    return {
      totalUsers,
      totalActiveUsers,
      totalSuspendedUsers,
      aiChatSessions,
    };
  }
}
