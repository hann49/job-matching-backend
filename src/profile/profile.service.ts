import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./profile.entity";
import { User } from "../users/user.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createProfile(userId: number, dto: CreateProfileDto) {
    const existingProfile = await this.profileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  if (existingProfile) {
  return {
    message: 'Profile already exists',
  };
  }
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
  const profile = this.profileRepository.create({
    skill: dto.skill,
    education: dto.education,
    experience: dto.experience,
    bio: dto.bio,
    phone: dto.phone,
    user: user,
  });
  await this.profileRepository.save(profile);
  return {
    message: 'Profile created successfully',
    profile,
  };
}
async getProfile(userId: number) {
  const profile = await this.profileRepository.findOne({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      user: true,
    },
  });
  if (!profile) {
    return {
      message: 'Profile not found',
    };
  }
  return {
    id: profile.id,
    skill: profile.skill,
    education: profile.education,
    experience: profile.experience,
    bio: profile.bio,
    phone: profile.phone,
    user: {
      id: profile.user.id,
      fullname: profile.user.fullname,
      email: profile.user.email,
      role: profile.user.role,
    },
  };
}
async updateProfile(userId: number, dto: UpdateProfileDto) {
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
  if (dto.skill !== undefined) {
    profile.skill = dto.skill;
  }
  if (dto.education !== undefined) {
    profile.education = dto.education;
  }
  if (dto.experience !== undefined) {
    profile.experience = dto.experience;
  }
  if (dto.bio !== undefined) {
    profile.bio = dto.bio;
  }
  if (dto.phone !== undefined) {
    profile.phone = dto.phone;
  }
  await this.profileRepository.save(profile);
  return {
    message: 'Profile updated successfully',
    profile,
  };
}
}