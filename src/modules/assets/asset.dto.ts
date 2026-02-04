import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { AssetStatus } from '../../common/enums/status.enum';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  asset_type_id: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsEnum(AssetStatus)
  status: AssetStatus = AssetStatus.AVAILABLE;

  @IsNotEmpty()
  @IsDateString()
  expired_at: Date;
}

export class UpdateAssetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  asset_type_id?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;

  @IsOptional()
  @IsDateString()
  expired_at?: Date;
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
