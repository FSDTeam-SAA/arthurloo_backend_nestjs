import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './app/module/auth/auth.module';
import { ParentsModule } from './app/module/parents/parents.module';
import { ChildrenModule } from './app/module/children/children.module';
import { ShearChildModule } from './app/module/shear-child/shear-child.module';
import config from './app/module/config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(config.mongoUri as string),
    AuthModule,
    ParentsModule,
    ChildrenModule,
    ShearChildModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
