import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Asset } from './entities/asset.entities';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AuthModule } from '../auth/auth.module';
import { AssetType } from '../assetTypes/entities/assetType.entities';
import { SystemLogModule } from '../systemLog/systemLog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetType]),
    AuthModule,
    SystemLogModule,
    BullModule.registerQueue({
      name: 'processing',
    }),
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule { }
