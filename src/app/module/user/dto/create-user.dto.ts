import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: ['teacher', 'parent', 'student', 'admin'] })
  @IsOptional()
  @IsEnum(['teacher', 'parent', 'student', 'admin'])
  role?: string;

  @ApiPropertyOptional({ enum: ['male', 'female'] })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({ example: '+8801712345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'I am a mathematics teacher.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ enum: ['panding', 'active', 'block'] })
  @IsOptional()
  @IsEnum(['panding', 'active', 'block'])
  status?: string;

  @ApiPropertyOptional({ example: '2000-05-10' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: 'Dhaka High School' })
  @IsOptional()
  @IsString()
  schoolAddress?: string;

  @ApiPropertyOptional({ example: 'Father' })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  otpExpiry?: Date;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  verifiedForget?: boolean;

  @ApiPropertyOptional({ example: 'acct_123456789' })
  @IsOptional()
  @IsString()
  stripeAccountId?: string;
}
