import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobService } from './jobs.service';
import { JobController } from './jobs.controller';
import { User } from '../users/user.entity';
import { Application } from '../application/application.entity';
import { Match } from '../matching/match.entity';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [TypeOrmModule.forFeature([Job, User, Application, Match])],
})
export class JobsModule {}
