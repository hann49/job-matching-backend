import {
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @IsOptional()
  requiredskill?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  deadline?: string;
}
