import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AdminController} from './admin.controller';
import {AdminService} from './admin.service';
import {User} from '../users/user.entity';
import { Application } from '../application/application.entity';
import { Profile } from '../profile/profile.entity';
import { Job } from '../jobs/job.entity';
import { Match } from '../matching/match.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Application, Job, Match])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}