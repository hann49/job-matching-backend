import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}
  async register(body: any) {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const allowedRoles = ['job_seeker', 'employer'];

    if (!allowedRoles.includes(body.role)) {
      throw new BadRequestException('Invalid role');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = this.userRepository.create({
      fullname: body.fullname,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      isEmailVerified: false,
      createdAt: new Date(),
    });

    await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = newUser;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }
  async login(body: any) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.isBlocked) {
      throw new ForbiddenException('Your account is blocked');
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken,
    };
  }

  async googleLogin(body: {
    idToken: string;
    mode: 'login' | 'register';
    role: 'job_seeker' | 'employer';
  }) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: body.idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid Google account data');
      }

      if (!payload.email_verified) {
        throw new UnauthorizedException('Google email is not verified');
      }

      const googleId = payload.sub;
      const email = payload.email;
      const fullname = payload.name || email.split('@')[0];

      // 1. Try to find existing Google account
      let user = await this.userRepository.findOne({
        where: { googleId },
      });

      if (user) {
        if (body.mode === 'register') {
          throw new ConflictException(
            'This Google account is already registered. Please sign in instead.',
          );
        }

        if (user.isBlocked) {
          throw new ForbiddenException('Your account is blocked');
        }

        const jwtPayload = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        const accessToken = this.jwtService.sign(jwtPayload);

        const { password, ...userWithoutPassword } = user;

        return {
          message: 'Google login successful',
          user: userWithoutPassword,
          accessToken,
        };
      }

      // 2. Google account not found → check email
     if (body.mode === 'login') {
       throw new UnauthorizedException(
         'Google account is not registered. Please create an account first.',
       );
     }

     // Only registration continues below

     user = await this.userRepository.findOne({
       where: { email },
     });

     if (user) {
       throw new ConflictException(
         'An account with this email already exists. Please sign in with your existing account.',
       );
     }

      // 3. Completely new JobMatch account
      user = this.userRepository.create({
        fullname,
        email,
        password: null,
        googleId,
        role: body.role,
        isEmailVerified: true,
        createdAt: new Date(),
      });

      await this.userRepository.save(user);

      const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(jwtPayload);

      const { password, ...userWithoutPassword } = user;

      return {
        message: 'Google account created successfully',
        user: userWithoutPassword,
        accessToken,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Google login error:', error);

      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
