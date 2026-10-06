import { Controller, Get, Param, Post, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchingService } from './matching.service';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generateMatches(@Req() req) {
    const userId = req.user.id;

    return await this.matchingService.generateMatches(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMatches(@Req() req) {
    const userId = req.user.id;

    return await this.matchingService.getMatches(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId/candidates')
  async getCandidatesForJob(@Req() req, @Param('jobId') jobId: string) {
    if (req.user.role !== 'employer') {
      throw new ForbiddenException(
        'Only employers can view recommended candidates',
      );
    }

    const numericJobId = Number(jobId);
    const employerId = req.user.id;

    return await this.matchingService.getCandidatesForJob(
      employerId,
      numericJobId,
    );
  }
}
