import { 
  Controller, Get, Patch, Param, 
  UseGuards, ParseIntPipe, Delete 
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('users')
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('users/:id/block')
  async blockUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.blockUser(id);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.deleteUser(id);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('jobs')
  async getAllJobs() {
    return await this.adminService.getAllJobs();
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('jobs/:id')
  async deleteJob(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.deleteJob(id);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('stats')
  async getStats() {
    return await this.adminService.getStats();
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('users/:id/unblock')
  async unblockUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.unblockUser(id);
  }
}
