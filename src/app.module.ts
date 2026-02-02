import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssetTypeModule } from './modules/assetTypes/assetType.module';
import { AssetModule } from './modules/assets/asset.module';
import { AssignmentModule } from './modules/assignments/assignment.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ReportModule } from './modules/reports/report.module';
import { ProcessorModule } from './modules/processor/processor.module';
import { redisConfig } from "./config/redis.config"
import { typeOrmConfig } from "./config/database.config"
import { bullBoardConfig } from "./config/bull-board.config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync(redisConfig),
    BullBoardModule.forRoot(bullBoardConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UserModule,
    AuthModule,
    AssetTypeModule,
    AssetModule,
    AssignmentModule,
    NotificationModule,
    ReportModule,
    ProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
