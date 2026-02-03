import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSystemLogDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsUUID()
  @IsOptional()
  targetId?: string;

  @IsString()
  @IsNotEmpty()
  targetType: string;

  @IsOptional()
  details?: any;
}

export class UpdateSystemLogDto extends PartialType(CreateSystemLogDto) {}

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
