import { Module } from '@nestjs/common';
import { ShearChildService } from './shear-child.service';
import { ShearChildController } from './shear-child.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShearChild, ShearChildSchema } from './entities/shear-child.entity';
import { Child, ChildSchema } from '../children/entities/child.entity';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShearChild.name, schema: ShearChildSchema },
      { name: Child.name, schema: ChildSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ShearChildController],
  providers: [ShearChildService],
})
export class ShearChildModule {}
