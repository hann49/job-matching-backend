import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Match } from './match.entity';
import { Profile } from '../profile/profile.entity';
import { Job } from '../jobs/job.entity';
import { User } from '../users/user.entity';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateMatches(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!profile) {
      return {
        message: 'Profile not found',
      };
    }

    const jobs = await this.jobRepository.find();

    if (jobs.length === 0) {
      return {
        message: 'No jobs found',
      };
    }

    const existingMatches = await this.matchRepository.find({
      where: {
        userId,
      },
    });

    const matchesByJobId = new Map(
      existingMatches.map((match) => [match.jobId, match]),
    );

    const profileSkills = profile.skill
      .toLowerCase()
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    for (const job of jobs) {
      const requiredSkills = job.requiredskill
        .toLowerCase()
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      if (requiredSkills.length === 0) {
        continue;
      }

      const matchedSkills = requiredSkills.filter((skill) =>
        profileSkills.includes(skill),
      );

      const matchScore = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100,
      );

      console.log('Job:', job.title);
      console.log('Matched skills:', matchedSkills);
      console.log('Match Score:', matchScore);

      const existingMatch = matchesByJobId.get(job.id);

      if (matchScore > 0) {
        if (existingMatch) {
          existingMatch.matchScore = matchScore;
          existingMatch.matchedAt = new Date();

          await this.matchRepository.save(existingMatch);
        } else {
          const match = this.matchRepository.create({
            userId,
            jobId: job.id,
            matchScore,
            matchedAt: new Date(),
          });

          await this.matchRepository.save(match);
        }
      } else {
        if (existingMatch) {
          await this.matchRepository.remove(existingMatch);
        }
      }
    }

    return {
      profile,
      jobs,
    };
  }

  async getCandidatesForJob(employerId: number, jobId: number) {
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

    const jobSeekers = await this.userRepository.find({
      where: {
        role: 'job_seeker',
      },
      relations: {
        profile: true,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
      },
    });

    const requiredSkills = job.requiredskill
      .toLowerCase()
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    if (requiredSkills.length === 0) {
      throw new Error('Job has no required skills');
    }

    const candidates: {
      jobSeeker: User;
      matchScore: number;
    }[] = [];

    for (const jobSeeker of jobSeekers) {
      if (!jobSeeker.profile) {
        continue;
      }

      const candidateSkills = jobSeeker.profile.skill
        .toLowerCase()
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const matchedSkills = requiredSkills.filter((skill) =>
        candidateSkills.includes(skill),
      );

      const matchScore = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100,
      );

      if (matchScore > 0) {
        candidates.push({
          jobSeeker,
          matchScore,
        });
      }
    }

    candidates.sort((a, b) => b.matchScore - a.matchScore);

    return {
      job,
      candidates,
    };
  }
  async getMatches(userId: number) {
    const matches = await this.matchRepository.find({
      where: {
        userId,
      },
    });

    if (matches.length === 0) {
      return {
        message: 'No matches found',
      };
    }

    const jobIds = matches.map((match) => match.jobId);

    const jobs = await this.jobRepository.find({
      where: {
        id: In(jobIds),
      },
    });

    const jobsById = new Map(jobs.map((job) => [job.id, job]));

    const recommendations: {
      job: Job;
      matchScore: number;
    }[] = [];

    for (const match of matches) {
      const job = jobsById.get(match.jobId);

      if (job) {
        recommendations.push({
          job,
          matchScore: match.matchScore,
        });
      }
    }

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }
}
