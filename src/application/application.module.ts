import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Application } from './application.entity';
import { Job } from '../jobs/job.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { User } from '../users/user.entity';


@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [TypeOrmModule.forFeature([Application, Job, User])],
})
export class ApplicationModule {}
