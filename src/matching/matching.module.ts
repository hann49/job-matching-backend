import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { Profile } from '../profile/profile.entity';
import { Job } from '../jobs/job.entity';
import { User } from '../users/user.entity';
@Module({
  providers: [MatchingService],
  controllers: [MatchingController],
  imports: [TypeOrmModule.forFeature([
    Match, 
    Profile, 
    Job,
    User,
  ]), 
],
})
export class MatchingModule {}
