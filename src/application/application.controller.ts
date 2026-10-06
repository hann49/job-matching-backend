import {
  Controller,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
  Param,
  Get,
  Patch,
  Body,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationService } from './application.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':jobId')
  async createApplication(@Req() req, @Param('jobId') jobId: string) {
    const applicantId = req.user.id;

    if (req.user.role !== 'job_seeker') {
      throw new ForbiddenException('Only job seekers can create applications');
    }

    const numericJobId = Number(jobId);

    return await this.applicationService.applyToJob(applicantId, numericJobId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyApplications(@Req() req) {
    const applicantId = req.user.id;
    if (req.user.role !== 'job_seeker') {
      throw new ForbiddenException(
        'Only job seekers can view their applications',
      );
    }
    return await this.applicationService.getMyApplications(applicantId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId')
  async getApplicationsForJob(@Req() req, @Param('jobId') jobId: string) {
    const employerId = req.user.id;
    if (req.user.role !== 'employer') {
      throw new ForbiddenException(
        'Only employers can view applications for their jobs',
      );
    }
    const numericJobId = Number(jobId);
    return await this.applicationService.getApplicationsForJob(
      employerId,
      numericJobId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateApplicationStatus(
    @Req() req,
    @Param('id') applicationId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    const employerId = req.user.id;

    if (req.user.role !== 'employer') {
      throw new ForbiddenException(
        'Only employers can update application status',
      );
    }

    const numericApplicationId = Number(applicationId);

    return await this.applicationService.updateApplicationStatus(
      employerId,
      numericApplicationId,
      dto.status,
    );
  }
}