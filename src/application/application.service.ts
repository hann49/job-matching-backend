import { NotFoundException, Injectable, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Job } from '../jobs/job.entity';
import { User } from '../users/user.entity';


@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}
  async applyToJob(applicantId: number, jobId: number) {
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
    const user = await this.userRepository.findOne({
      where: {
        id: applicantId,
      },
    });

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: {
        applicant: {
          id: applicantId,
        },
        job: {
          id: jobId,
        },
      },
    });
    if (existingApplication) {
      return {
        message: 'You have already applied to this job',
      };
    }
    const application = this.applicationRepository.create({
      applicant: user,
      job,
      status: 'pending',
    });
    await this.applicationRepository.save(application);
    return {
      message: 'Application submitted successfully',
    };
  }
  async getMyApplications(applicantId: number) {
    const applications = await this.applicationRepository.find({
      where: {
        applicant: {
          id: applicantId,
        },
      },
      relations: {
        job: true,
      },
    });

    return applications;
  }
  async getApplicationsForJob(employerId: number, jobId: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.posted_by !== employerId) {
      throw new ForbiddenException('You are not the employer of this job');
    }

    const applications = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.applicant', 'applicant')
      .leftJoinAndSelect('applicant.profile', 'profile')
      .where('application.job_id = :jobId', { jobId })
      .select([
        'application.id',
        'application.status',
        'application.appliedAt',
        'applicant.id',
        'applicant.fullname',
        'applicant.email',
        'applicant.role',
        'profile.id',
        'profile.skill',
        'profile.education',
        'profile.experience',
        'profile.bio',
        'profile.phone',
      ])
      .getMany();

    return applications;
  }
  async updateApplicationStatus(employerId: number, applicationId: number, status: string) {
    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationId,
      },
      relations: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }
    
    if (application.job.posted_by !== employerId) {
      throw new ForbiddenException('You are not the employer of this application');
    }

    application.status = status;
    await this.applicationRepository.save(application);
    return{
      message: 'Application status updated successfully',
      application,
    };
  }
}
