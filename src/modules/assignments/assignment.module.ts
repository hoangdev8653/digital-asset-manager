import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Assignments } from './entities/assignment.entities';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { AuthModule } from '../auth/auth.module';
import { Asset } from '../assets/entities/asset.entities';
import { User } from '../users/entities/user.entities';
import { NotificationModule } from "../notifications/notification.module"
import { Notification } from "../notifications/entities/notification.entities"
import { SystemLogModule } from '../systemLog/systemLog.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignments, Asset, User, Notification]),
    AuthModule,
    NotificationModule,
    SystemLogModule,
    UserModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
    BullBoardModule.forFeature({
      name: 'notifications',
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule { }
