import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NOTIFICATION_QUEUE, JOB_SEND_STAFF, JOB_SEND_ADMIN } from '../../utils/constants';

@Processor(NOTIFICATION_QUEUE)

export class NotificationProcessor extends WorkerHost {
    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case JOB_SEND_STAFF:
                console.log(`Gửi thông báo cho nhân viên ${job.data.staffId}: ${job.data.message}`);
                // Logic gửi Email/Socket ở đây
                break;

            case JOB_SEND_ADMIN:
                console.log(`Gửi thông báo cho Admin: ${job.data.message}`);
                // Logic gửi Telegram/Admin Dashboard ở đây
                break;
        }
    }
}