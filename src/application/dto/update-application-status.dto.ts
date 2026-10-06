import { IsString, IsIn} from 'class-validator';

export class UpdateApplicationStatusDto {

  @IsString()
  @IsIn(['accepted', 'rejected'])
  status!: string;
}

