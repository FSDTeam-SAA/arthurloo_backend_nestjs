import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateShearChildDto {
  @ApiProperty({ example: '60d5ec49f9f1c2a4b8e1d3a1' })
  @IsMongoId()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({ example: 'STU-101' })
  @IsString()
  @IsNotEmpty()
  childId: string;
}

export class UpdateShearChildStatusDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
