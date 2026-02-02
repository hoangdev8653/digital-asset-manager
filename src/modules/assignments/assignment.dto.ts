import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { AssignmentStatus } from '../../common/enums/status.enum';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsUUID()
  asset_id: string;

  @IsNotEmpty()
  @IsUUID()
  employee_id: string;

  @IsOptional()
  @IsUUID()
  assigned_by: string;

  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsDateString()
  expired_at: Date;
}

export class UpdateAssignmentDto {
  @IsOptional()
  @IsUUID()
  asset_id?: string;

  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  assigned_by?: string;

  @IsOptional()
  @IsDateString()
  assigned_at?: Date;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  expired_at?: Date;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
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
