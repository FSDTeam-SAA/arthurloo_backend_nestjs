import { Transform } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const parseOptionalArray = ({ value }: { value: unknown }) => {
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

const parseOptionalObject = ({ value }: { value: unknown }) => {
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
  @ApiPropertyOptional({ example: 120 })
  value?: number;

  @ApiPropertyOptional({ example: 'cm' })
  unit?: string;
}

export class CreateChildDto {
  @ApiPropertyOptional({ example: '67c8db1f2b5d8c6d1f123456' })
  @IsMongoId()
  @IsOptional()
  teacherId?: string;

  @ApiPropertyOptional({ example: 'Liam' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Noah' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '7' })
  @IsString()
  @IsOptional()
  age?: string;

  @ApiPropertyOptional({ example: 'male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: '2018-05-10T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  datoOfBirth?: string;

  @ApiPropertyOptional({ example: 'Greenfield School' })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiPropertyOptional({ example: 'Grade 2' })
  @IsString()
  @IsOptional()
  class?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'Leo' })
  @IsString()
  @IsOptional()
  nickName?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsString()
  @IsOptional()
  primaryLanguage?: string;

  @ApiPropertyOptional({ example: 'Bangla' })
  @IsString()
  @IsOptional()
  homeLanguage?: string;

  @ApiPropertyOptional({ example: 'Assessment' })
  @IsString()
  @IsOptional()
  serviceStage?: string;

  @ApiPropertyOptional({ example: '2025-01-10T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  startServiceDate?: string;

  @ApiPropertyOptional({ example: 'Premium' })
  @IsString()
  @IsOptional()
  currentPlanType?: string;

  @ApiPropertyOptional({ example: 'Speech support' })
  @IsString()
  @IsOptional()
  topPriority?: string;

  @ApiPropertyOptional({ example: 'Puzzle solving' })
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiPropertyOptional({ example: 'Difficulty with transitions' })
  @IsString()
  @IsOptional()
  concerns?: string;

  @ApiPropertyOptional({ type: [String], example: ['Sticker', 'Music'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  preferredReinforcers?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Loud noise', 'Crowded places'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  knownTrigger?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Verbal', 'PECS'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  communicationMode?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Elopement risk'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  safetyAlerts?: string[];

  @ApiPropertyOptional({ example: 'Moderate' })
  @IsString()
  @IsOptional()
  emotionalLevel?: string;

  @ApiPropertyOptional({ example: 'Needs support' })
  @IsString()
  @IsOptional()
  sensoryRegulationLevel?: string;

  @ApiPropertyOptional({ example: 'Emerging' })
  @IsString()
  @IsOptional()
  socialLevel?: string;

  @ApiPropertyOptional({ example: 'Functional' })
  @IsString()
  @IsOptional()
  communicationLevel?: string;

  @ApiPropertyOptional({ example: 'Age appropriate' })
  @IsString()
  @IsOptional()
  cognitiveLevel?: string;

  @ApiPropertyOptional({ example: 'Needs prompts' })
  @IsString()
  @IsOptional()
  selfcareLevel?: string;

  @ApiPropertyOptional({ example: 'Good balance' })
  @IsString()
  @IsOptional()
  grossMotorLevel?: string;

  @ApiPropertyOptional({ example: 'Improving grip' })
  @IsString()
  @IsOptional()
  fineMotorLevel?: string;

  @ApiPropertyOptional({
    type: MeasurementDto,
    example: { value: 120, unit: 'cm' },
  })
  @Transform(parseOptionalObject)
  @IsObject()
  @IsOptional()
  height?: MeasurementDto;

  @ApiPropertyOptional({
    type: MeasurementDto,
    example: { value: 22, unit: 'kg' },
  })
  @Transform(parseOptionalObject)
  @IsObject()
  @IsOptional()
  weight?: MeasurementDto;

  @ApiPropertyOptional({ example: 'Peanut' })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({ example: 'No dairy' })
  @IsString()
  @IsOptional()
  dieteryRestrictions?: string;

  @ApiPropertyOptional({ example: 'Needs supervision during meals' })
  @IsString()
  @IsOptional()
  eatingNotes?: string;

  @ApiPropertyOptional({ example: 'Vitamin D' })
  @IsString()
  @IsOptional()
  medications?: string;

  @ApiPropertyOptional({ example: 'Carries inhaler' })
  @IsString()
  @IsOptional()
  medicalNotes?: string;

  @ApiPropertyOptional({ example: 'Asthma' })
  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @ApiPropertyOptional({ example: 'STU-1001' })
  @IsString()
  @IsOptional()
  studentId?: string;
}
