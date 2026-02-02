import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetType } from './entities/assetType.entities';
import { AssetTypeController } from './assetType.controller';
import { AssetTypeService } from './assetType.service';
import { AuthModule } from '../auth/auth.module';
import { Asset } from '../assets/entities/asset.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetType]), AuthModule],
  controllers: [AssetTypeController],
  providers: [AssetTypeService],
  exports: [AssetTypeService],
})
export class AssetTypeModule {}
