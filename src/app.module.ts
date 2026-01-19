import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssetTypeModule } from './modules/assetTypes/assetType.module';
import { AssetModule } from './modules/assets/asset.module';
import { AssignmentModule } from './modules/assignments/assignment.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ReportModule } from './modules/reports/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: process.env.SYNCHRONIZE === 'true',
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    AssetTypeModule,
    AssetModule,
    AssignmentModule,
    NotificationModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
