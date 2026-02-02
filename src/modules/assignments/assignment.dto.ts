import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  asset_id: string;

  @IsNotEmpty()
  @IsString()
  employee_id: string;

  @IsOptional()
  @IsString()
  assigned_by: string;

  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsString()
  expired_at: Date;
}

export class UpdateAssignmentDto {
  @IsString()
  asset_id?: string;

  @IsString()
  employee_id?: string;

  @IsString()
  assigned_by?: string;

  @IsString()
  assigned_at?: Date;

  @IsString()
  note?: string;

  @IsString()
  expired_at?: Date;

  @IsString()
  status?: string;
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
