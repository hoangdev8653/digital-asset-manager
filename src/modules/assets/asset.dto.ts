import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  asset_type_id: string;

  @IsNotEmpty()
  @IsString()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  status: string = 'available';

  @IsNotEmpty()
  @IsString()
  expired_at: Date;
}

export class UpdateAssetDto {
  @IsString()
  title?: string;

  @IsString()
  asset_type_id?: string;

  @IsString()
  metadata?: Record<string, any>;

  @IsString()
  status?: string;

  @IsString()
  expired_at?: Date;
}
