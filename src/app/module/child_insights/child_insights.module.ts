import { Module } from '@nestjs/common';
import { ChildInsightsService } from './child_insights.service';
import { ChildInsightsController } from './child_insights.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChildInsight,
  ChildInsightSchema,
} from './entities/child_insight.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { Child, ChildSchema } from '../children/entities/child.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChildInsight.name, schema: ChildInsightSchema },
      { name: User.name, schema: UserSchema },
      { name: Child.name, schema: ChildSchema },
    ]),
  ],
  controllers: [ChildInsightsController],
  providers: [ChildInsightsService],
})
export class ChildInsightsModule {}
