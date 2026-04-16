import { PartialType } from '@nestjs/swagger';
import { CreateChildInsightDto } from './create-child_insight.dto';

export class UpdateChildInsightDto extends PartialType(CreateChildInsightDto) {}
