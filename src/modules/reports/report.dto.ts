import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  assignment_id: string;

  @IsNotEmpty()
  @IsString()
  employee_id: string;

  @IsNotEmpty()
  @IsString()
  report_type: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  status: string = 'pending';

  @IsOptional()
  admin_note: string | null = null;

  @IsOptional()
  resolved_at: Date | null = null;
}

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  report_type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  admin_note?: string;

  @IsOptional()
  @IsString()
  resolved_at?: Date;
}
