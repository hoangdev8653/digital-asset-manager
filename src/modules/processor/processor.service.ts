import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE, JOB_SEND_STAFF, JOB_SEND_ADMIN } from '../../utils/constants';

@Injectable()
export class NotificationsService {
    constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly notifyQueue: Queue) { }

    async notifyStaff(staffId: string, message: string) {
        await this.notifyQueue.add(JOB_SEND_STAFF, { staffId, message }, {
            attempts: 3,
            backoff: 5000,
        });
    }

    async notifyAdmin(message: string) {
        await this.notifyQueue.add(JOB_SEND_ADMIN, { message });
    }
}