import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AssignmentProcessor } from './notification.processor';
import { Assignments } from '../assignments/entities/assignment.entities';
import { NotificationModule } from '../notifications/notification.module';
import { UserModule } from '../users/user.module';
import { ImportProcessor } from './import.processor';
import { Asset } from '../assets/entities/asset.entities';
import { AssetType } from '../assetTypes/entities/assetType.entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([Assignments, Asset, AssetType]),
        BullModule.registerQueue({
            name: 'notifications',
        }),
        BullModule.registerQueue({
            name: 'processing',
        }),
        NotificationModule,
        UserModule,
    ],
    providers: [AssignmentProcessor, ImportProcessor],
})
export class WorkerModule { }
