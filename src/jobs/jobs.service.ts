import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { User } from '../users/user.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Application } from '../application/application.entity';
import { Match } from '../matching/match.entity';

@Injectable()
export class JobService {
  constructor(
  @InjectRepository(Job)
  private jobRepository: Repository<Job>,

  @InjectRepository(User)
  private userRepository: Repository<User>,

  @InjectRepository(Application)
  private applicationRepository: Repository<Application>,

  @InjectRepository(Match)
  private matchRepository: Repository<Match>,
) {}
  async createJob(userId: number, dto: CreateJobDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    const job = this.jobRepository.create({
      title: dto.title,
      description: dto.description,
      requiredskill: dto.requiredskill,
      deadline: dto.deadline,
      posted_by: userId,
    });

    await this.jobRepository.save(job);

    return {
      message: 'Job created successfully',
      job,
    };
  }

  async getJobs() {
    const jobs = await this.jobRepository.find();
    if (jobs.length === 0) {
      return {
        message: 'No jobs found',
      };
    }

    return jobs;
  }
  async updateJob(userId: number, jobId: number, dto: UpdateJobDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.posted_by !== userId) {
      throw new ForbiddenException('You can only update your own jobs');
    }
    if (dto.title !== undefined) {
      job.title = dto.title;
    }
    if (dto.description !== undefined) {
      job.description = dto.description;
    }
    if (dto.requiredskill !== undefined) {
      job.requiredskill = dto.requiredskill;
    }
    if (dto.deadline !== undefined) {
      job.deadline = dto.deadline;
    }
    await this.jobRepository.save(job);
    return {
      message: 'Job updated successfully',
      job,
    };
  }
 async deleteJob(userId: number, jobId: number) {
  const job = await this.jobRepository.findOne({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  if (job.posted_by !== userId) {
    throw new ForbiddenException('You can only delete your own jobs');
  }

  await this.applicationRepository.delete({
    job: { id: job.id },
  });

  await this.matchRepository.delete({
    jobId: job.id,
  });

  await this.jobRepository.delete(job.id);

  return {
    message: 'Job deleted successfully',
  };
}
  async getJob(jobId: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      return {
        message: 'Job not found',
      };
    }
    return job;
  }
  async getMyJobs(userId: number) {
    const jobs = await this.jobRepository.find({
      where: {
        posted_by: userId,
      },
    });
    return jobs;
  }
}
