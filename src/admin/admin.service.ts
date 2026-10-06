import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from '../users/user.entity';
import { Profile } from '../profile/profile.entity';
import { Application } from '../application/application.entity';
import { Job } from '../jobs/job.entity';
import { Match } from '../matching/match.entity';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getAllUsers() {
    return await this.userRepository.find({
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        isEmailVerified: true,
        isBlocked: true,
        createdAt: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }
  async blockUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isBlocked = true;

    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'User blocked successfully',
      user: userWithoutPassword,
    };
  }
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.matchRepository.delete({
      userId: user.id,
    });

    await this.applicationRepository.delete({
      applicant: {
        id: user.id,
      },
    });

    await this.profileRepository.delete({
      user: {
        id: user.id,
      },
    });

    if (user.role === 'employer') {
      const jobs = await this.jobRepository.find({
        where: {
          posted_by: user.id,
        },
      });

      for (const job of jobs) {
        await this.applicationRepository.delete({
          job: {
            id: job.id,
          },
        });
        await this.matchRepository.delete({
          jobId: job.id,
        });

        await this.jobRepository.delete(job.id);
      }
    }
    await this.userRepository.delete(user.id);

    return {
      message: 'User deleted successfully',
    };
  }
  async getAllJobs() {
    const jobs = await this.jobRepository.find({
      select: {
        id: true,
        posted_by: true,
        title: true,
        description: true,
        requiredskill: true,
        deadline: true,
        createdAt: true,
      },
      order: {
        id: 'ASC',
      },
    });

    if (jobs.length === 0) {
      return [];
    }

    const employerIds = [...new Set(jobs.map((job) => job.posted_by))];

    const employers = await this.userRepository.find({
      where: {
        id: In(employerIds),
        role: 'employer',
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });

    const employersById = new Map(
      employers.map((employer) => [employer.id, employer]),
    );

    return jobs.map((job) => {
      const employer = employersById.get(job.posted_by);

      return {
        ...job,
        postedByName: employer?.fullname || 'Unknown employer',
        postedByEmail: employer?.email || 'Unknown email',
      };
    });
  }
  async deleteJob(jobId: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    await this.applicationRepository.delete({
      job: {
        id: job.id,
      },
    });
    await this.matchRepository.delete({
      jobId: job.id,
    });

    await this.jobRepository.delete(job.id);

    return {
      message: 'Job deleted successfully',
    };
  }
  async getStats() {
    const [
      totalUsers,
      jobSeekers,
      employers,
      admins,
      blockedUsers,
      totalJobs,
      totalApplications,
    ] = await Promise.all([
      this.userRepository.count(),

      this.userRepository.count({
        where: {
          role: 'job_seeker',
        },
      }),

      this.userRepository.count({
        where: {
          role: 'employer',
        },
      }),

      this.userRepository.count({
        where: {
          role: 'admin',
        },
      }),

      this.userRepository.count({
        where: {
          isBlocked: true,
        },
      }),

      this.jobRepository.count(),

      this.applicationRepository.count(),
    ]);

    return {
      totalUsers,
      jobSeekers,
      employers,
      admins,
      blockedUsers,
      totalJobs,
      totalApplications,
    };
  }
  async unblockUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isBlocked = false;

    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'User unblocked successfully',
      user: userWithoutPassword,
    };
  }
}
