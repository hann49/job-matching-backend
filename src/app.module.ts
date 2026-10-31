import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { MatchingModule } from './matching/matching.module';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      // Use Render PostgreSQL when deployed.
      // Otherwise, use your local PostgreSQL database.
      ...(process.env.RENDER_DATABASE_URL
        ? {
            url: process.env.RENDER_DATABASE_URL,
          }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'job_matching',
          }),

      autoLoadEntities: true,
      synchronize: false,
    }),

    UsersModule,
    JobsModule,
    ApplicationModule,
    AuthModule,
    MatchingModule,
    ProfileModule,
    AdminModule,
  ],
})
export class AppModule {}
