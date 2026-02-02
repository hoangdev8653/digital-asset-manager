import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './processor.service';
import { NotificationProcessor } from './processor.controller';
import { NOTIFICATION_QUEUE } from '../../utils/constants';

@Module({
    imports: [
        BullModule.registerQueue({
            name: NOTIFICATION_QUEUE,
        }),
    ],
    providers: [NotificationsService, NotificationProcessor],
    exports: [NotificationsService],
})
export class ProcessorModule { }