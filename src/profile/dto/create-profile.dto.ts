import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  skill!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  education!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  experience!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  bio!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone!: string;
}
