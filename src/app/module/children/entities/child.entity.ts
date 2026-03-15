import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChildDocument = HydratedDocument<Child>;

@Schema({ timestamps: true })
export class Child {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  parentId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  teacherId: mongoose.Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  age: string;

  @Prop()
  gender: string;

  @Prop()
  datoOfBirth: Date;

  @Prop()
  schoolName: string;

  @Prop()
  class: string;

  @Prop()
  profilePicture: string;

  @Prop()
  nickName: string;

  @Prop()
  primaryLanguage: string;

  @Prop()
  homeLanguage: string;

  @Prop()
  serviceStage: string;

  @Prop()
  startServiceDate: Date;

  @Prop()
  currentPlanType: string;

  @Prop()
  topPriority: string;

  @Prop()
  strength: string;

  @Prop()
  concerns: string;

  @Prop()
  preferredReinforcers: string[];

  @Prop()
  knownTrigger: string[];

  @Prop()
  communicationMode: string[];

  @Prop()
  safetyAlerts: string[];

  @Prop()
  emotionalLevel: string;

  @Prop()
  sensoryRegulationLevel: string;

  @Prop()
  socialLevel: string;

  @Prop()
  communicationLevel: string;

  @Prop()
  cognitiveLevel: string;

  @Prop()
  selfcareLevel: string;

  @Prop()
  grossMotorLevel: string;

  @Prop()
  fineMotorLevel: string;

  @Prop({
    _id: false,
    type: {
      value: { type: Number },
      unit: { type: String },
    },
  })
  height: {
    value: number;
    unit: string;
  };

  @Prop({
    _id: false,
    type: {
      value: { type: Number },
      unit: { type: String },
    },
  })
  weight: {
    value: number;
    unit: string;
  };

  @Prop()
  allergies: string;

  @Prop()
  dieteryRestrictions: string;

  @Prop()
  eatingNotes: string;

  @Prop()
  medications: string;

  @Prop()
  medicalNotes: string;

  @Prop()
  medicalHistory: string;

  @Prop()
  studentId: string;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
