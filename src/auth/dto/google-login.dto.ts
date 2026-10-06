import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsIn(['login', 'register'])
  mode: 'login' | 'register';

  @IsIn(['job_seeker', 'employer'])
  role: 'job_seeker' | 'employer';
}
