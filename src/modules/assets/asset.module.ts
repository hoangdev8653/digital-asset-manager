import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entities';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AuthModule } from '../auth/auth.module';
import { AssetType } from '../assetTypes/entities/assetType.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetType]), AuthModule],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
