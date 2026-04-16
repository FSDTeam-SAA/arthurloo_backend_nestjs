import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class InsightFieldDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreateChildInsightDto {
  @IsMongoId()
  @IsNotEmpty()
  childId: string;

  @IsMongoId()
  @IsNotEmpty()
  teacherId: string;

  @IsMongoId()
  @IsNotEmpty()
  parentId: string;

  @ValidateNested()
  @Type(() => InsightFieldDto)
  personality_and_interest: InsightFieldDto;

  @ValidateNested()
  @Type(() => InsightFieldDto)
  learning_style: InsightFieldDto;

  @ValidateNested()
  @Type(() => InsightFieldDto)
  personal_ability: InsightFieldDto;
}
