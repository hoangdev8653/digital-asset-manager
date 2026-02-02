import {
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '../../common/enums/status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'EMPLOYEE'])
  role?: 'ADMIN' | 'EMPLOYEE';

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
