import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";


@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createProfile(@Req() req, @Body() dto: CreateProfileDto) {
        const userId = req.user.id;
        return await this.profileService.createProfile(userId, dto);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@Req() req) {
        const userId = req.user.id;
        return await this.profileService.getProfile(userId);
    }
    @UseGuards(JwtAuthGuard)
    @Put()
     async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
        const userId = req.user.id;
        return await this.profileService.updateProfile(userId, dto);
    }
}