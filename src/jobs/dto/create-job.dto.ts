import { IsString, IsNotEmpty, MaxLength, IsDateString} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  requiredskill!: string;

  @IsDateString()
  @IsNotEmpty()
  deadline!: string;
}

