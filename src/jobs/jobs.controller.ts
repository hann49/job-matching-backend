import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
  Get,
  Put, 
  Param,
  Delete
} from '@nestjs/common';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JobService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from './dto/update-job.dto';


@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Req() req, @Body() dto: CreateJobDto) {
    const userId = req.user.id;
    if (req.user.role !== 'employer') {
      throw new ForbiddenException('Only employers can post jobs');
    }

    return await this.jobService.createJob(userId, dto);
  }
  @Get()
  async getJobs() {
    return await this.jobService.getJobs();
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateJob(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    const userId = req.user.id;
    if (req.user.role !== 'employer') {
      throw new ForbiddenException('Only employers can update job');
    }
    const jobId = Number(id);

    return await this.jobService.updateJob(userId, jobId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    if (req.user.role !== 'employer') {
      throw new ForbiddenException('Only employers can delete job');
    }
    const jobId = Number(id);

    return await this.jobService.deleteJob(userId, jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyJobs(@Req() req) {
    const userId = req.user.id;
    if (req.user.role !== 'employer') {
      throw new ForbiddenException('Only employers can view their jobs');
    }
    return await this.jobService.getMyJobs(userId);
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    const jobId = Number(id);
    return await this.jobService.getJob(jobId);
  }
}
