import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  status: string;
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
