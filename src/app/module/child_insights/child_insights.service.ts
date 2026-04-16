import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChildInsight } from './entities/child_insight.entity';
import { User } from '../user/entities/user.entity';
import { Child } from '../children/entities/child.entity';
import { getAiResponse } from 'src/app/helpers/aiapi';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import { IFilterParams } from 'src/app/helpers/pick';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class ChildInsightsService {
  constructor(
    @InjectModel(ChildInsight.name)
    private childInsightModel: Model<ChildInsight>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Child.name) private childModel: Model<Child>,
  ) {}

  async chatGetChildInsight(childId: string) {
    const child = await this.childModel.findById(childId);
    if (!child) throw new HttpException('Child not found', 404);

    const existingInsight = await this.childInsightModel.findOne({
      childId: child._id,
    });

    // Check which fields have changed (run ID on Child differs from stored ID)
    const needsPersonalityUpdate =
      child.personality_and_interest &&
      child.personality_and_interest !==
        existingInsight?.personality_and_interest?.id;

    const needsLearningStyleUpdate =
      child.learning_style &&
      child.learning_style !== existingInsight?.learning_style?.id;

    const needsPersonalAbilityUpdate =
      child.personal_ability &&
      child.personal_ability !== existingInsight?.personal_ability?.id;

    // If existing insight exists and nothing changed, return as-is
    if (
      existingInsight &&
      !needsPersonalityUpdate &&
      !needsLearningStyleUpdate &&
      !needsPersonalAbilityUpdate
    ) {
      return existingInsight;
    }

    // Fetch only the changed AI responses
    const personalityData = needsPersonalityUpdate
      ? await getAiResponse(child.personality_and_interest)
      : null;

    const learningStyleData = needsLearningStyleUpdate
      ? await getAiResponse(child.learning_style)
      : null;

    const personalAbilityData = needsPersonalAbilityUpdate
      ? await getAiResponse(child.personal_ability)
      : null;

    if (
      !personalityData &&
      !learningStyleData &&
      !personalAbilityData &&
      !existingInsight
    ) {
      throw new HttpException('Child insight not found', 404);
    }

    // Build update payload with only changed fields
    const updateData: Record<string, any> = {};

    if (personalityData) {
      updateData.personality_and_interest = {
        id: child.personality_and_interest,
        text: personalityData.data,
      };
    }
    if (learningStyleData) {
      updateData.learning_style = {
        id: child.learning_style,
        text: learningStyleData.data,
      };
    }
    if (personalAbilityData) {
      updateData.personal_ability = {
        id: child.personal_ability,
        text: personalAbilityData.data,
      };
    }

    if (existingInsight) {
      // Update only the changed fields
      const updated = await this.childInsightModel.findByIdAndUpdate(
        existingInsight._id,
        { $set: updateData },
        { new: true },
      );

      return updated;
    }

    // No existing insight — create new
    const insight = await this.childInsightModel.create({
      childId: child._id,
      teacherId: child.teacherId,
      parentId: child.parentId,
      ...updateData,
    });

    return insight;
  }
}
