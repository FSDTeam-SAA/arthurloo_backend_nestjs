import { PartialType } from '@nestjs/swagger';
import { CreateShearChildDto } from './create-shear-child.dto';

export class UpdateShearChildDto extends PartialType(CreateShearChildDto) {}
