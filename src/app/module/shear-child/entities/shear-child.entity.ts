import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShearChildDocument = HydratedDocument<ShearChild>;

@Schema({ timestamps: true })
export class ShearChild {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Child' })
  childId: Types.ObjectId;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  parentId: Types.ObjectId;
}

export const ShearChildSchema = SchemaFactory.createForClass(ShearChild);
