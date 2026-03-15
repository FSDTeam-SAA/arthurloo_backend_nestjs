import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const emptyStringToUndefined = ({ value }: { value: unknown }) =>
  value === '' || value === null ? undefined : value;

const parseDateValue = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  return value instanceof Date ? value : new Date(String(value));
};

const parseStringArray = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return value;
};

const parseMeasurement = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

class MeasurementDto {
  @ApiPropertyOptional({ example: 120, description: 'Measurement value' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiPropertyOptional({ example: 'cm', description: 'Measurement unit' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateChildDto {
  @ApiPropertyOptional({
    example: '67c8db1f2b5d8c6d1f123456',
    description: 'Teacher id',
  })
  @Transform(emptyStringToUndefined)
  @IsMongoId()
  @IsOptional()
  teacherId?: string;

  @ApiPropertyOptional({ example: 'Liam', description: 'Child first name' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Noah', description: 'Child last name' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '7', description: 'Child age' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  age?: string;

  @ApiPropertyOptional({
    example: 'male',
    description: 'Child gender',
    enum: ['male', 'female', 'other'],
  })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: '2018-05-10T00:00:00.000Z',
    description: 'Date of birth',
  })
  @Transform(parseDateValue)
  @IsDate()
  @IsOptional()
  datoOfBirth?: Date;

  @ApiPropertyOptional({ example: 'Greenfield School', description: 'School name' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiPropertyOptional({ example: 'Grade 2', description: 'Current class' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  class?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile picture file',
  })
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'Leo', description: 'Nick name' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  nickName?: string;

  @ApiPropertyOptional({ example: 'English', description: 'Primary language' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  primaryLanguage?: string;

  @ApiPropertyOptional({ example: 'Bangla', description: 'Home language' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  homeLanguage?: string;

  @ApiPropertyOptional({ example: 'Assessment', description: 'Service stage' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  serviceStage?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: '2025-01-10T00:00:00.000Z',
    description: 'Service start date',
  })
  @Transform(parseDateValue)
  @IsDate()
  @IsOptional()
  startServiceDate?: Date;

  @ApiPropertyOptional({ example: 'Premium', description: 'Current plan type' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  currentPlanType?: string;

  @ApiPropertyOptional({ example: 'Speech support', description: 'Top priority' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  topPriority?: string;

  @ApiPropertyOptional({ example: 'Puzzle solving', description: 'Child strength' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiPropertyOptional({ example: 'Difficulty with transitions', description: 'Parent concerns' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  concerns?: string;

  @ApiPropertyOptional({
    example: ['Sticker', 'Music'],
    description: 'Preferred reinforcers',
    type: [String],
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredReinforcers?: string[];

  @ApiPropertyOptional({
    example: ['Loud noise', 'Crowded places'],
    description: 'Known triggers',
    type: [String],
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  knownTrigger?: string[];

  @ApiPropertyOptional({
    example: ['Verbal', 'PECS'],
    description: 'Communication modes',
    type: [String],
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  communicationMode?: string[];

  @ApiPropertyOptional({
    example: ['Elopement risk'],
    description: 'Safety alerts',
    type: [String],
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  safetyAlerts?: string[];

  @ApiPropertyOptional({ example: 'Moderate', description: 'Emotional level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  emotionalLevel?: string;

  @ApiPropertyOptional({ example: 'Needs support', description: 'Sensory regulation level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  sensoryRegulationLevel?: string;

  @ApiPropertyOptional({ example: 'Emerging', description: 'Social level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  socialLevel?: string;

  @ApiPropertyOptional({ example: 'Functional', description: 'Communication level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  communicationLevel?: string;

  @ApiPropertyOptional({ example: 'Age appropriate', description: 'Cognitive level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  cognitiveLevel?: string;

  @ApiPropertyOptional({ example: 'Needs prompts', description: 'Self care level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  selfcareLevel?: string;

  @ApiPropertyOptional({ example: 'Good balance', description: 'Gross motor level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  grossMotorLevel?: string;

  @ApiPropertyOptional({ example: 'Improving grip', description: 'Fine motor level' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  fineMotorLevel?: string;

  @ApiPropertyOptional({
    description: 'Height object',
    type: MeasurementDto,
    example: { value: 120, unit: 'cm' },
  })
  @Transform(parseMeasurement)
  @Type(() => MeasurementDto)
  @ValidateNested()
  @IsOptional()
  height?: MeasurementDto;

  @ApiPropertyOptional({
    description: 'Weight object',
    type: MeasurementDto,
    example: { value: 22, unit: 'kg' },
  })
  @Transform(parseMeasurement)
  @Type(() => MeasurementDto)
  @ValidateNested()
  @IsOptional()
  weight?: MeasurementDto;

  @ApiPropertyOptional({ example: 'Peanut', description: 'Allergies' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({ example: 'No dairy', description: 'Dietary restrictions' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  dieteryRestrictions?: string;

  @ApiPropertyOptional({ example: 'Needs supervision during meals', description: 'Eating notes' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  eatingNotes?: string;

  @ApiPropertyOptional({ example: 'Vitamin D', description: 'Medications' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  medications?: string;

  @ApiPropertyOptional({ example: 'Carries inhaler', description: 'Medical notes' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  medicalNotes?: string;

  @ApiPropertyOptional({ example: 'Asthma', description: 'Medical history' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @ApiPropertyOptional({ example: 'STD-1001', description: 'Student id' })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  studentId?: string;
}
