import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ChildInsightDocument = HydratedDocument<ChildInsight>;

class InsightField {
  @Prop()
  id: string;

  @Prop()
  text: string;
}

@Schema({ timestamps: true })
export class ChildInsight {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true })
  childId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  parentId: Types.ObjectId;

  @Prop({ type: InsightField, _id: false })
  personality_and_interest: InsightField;

  @Prop({ type: InsightField, _id: false })
  learning_style: InsightField;

  @Prop({ type: InsightField, _id: false })
  personal_ability: InsightField;
}

export const ChildInsightSchema = SchemaFactory.createForClass(ChildInsight);
