import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import config from '../../config';
import { UserRole, UserStatus } from '../user.constants';


export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role: string;

  @Prop({ enum: ['male', 'female'] })
  gender: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  bio: string;

  @Prop()
  profilePicture: string;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  schoolAddress: string;

  @Prop()
  relationship: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop({ default: false })
  verifiedForget: boolean;

  @Prop()
  stripeAccountId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );
});
