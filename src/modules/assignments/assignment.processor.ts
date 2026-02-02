import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationService } from '../notifications/notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignments } from './entities/assignment.entities';
import { Repository } from 'typeorm';

@Processor('notifications')
export class AssignmentProcessor extends WorkerHost {
    constructor(
        private readonly notificationService: NotificationService,
        @InjectRepository(Assignments)
        private readonly assignmentsRepository: Repository<Assignments>,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'expiry-notification':
                await this.handleExpiryNotification(job.data);
                break;
            default:
                console.warn(`Unknown job name: ${job.name}`);
        }
    }

    private async handleExpiryNotification(data: {
        assignmentId: string;
        userId: string;
        assetTitle: string;
    }) {
        const { assignmentId, userId, assetTitle } = data;

        // Double check if assignment is still valid (not deleted or returned)
        const assignment = await this.assignmentsRepository.findOne({
            where: { id: assignmentId },
        });

        if (!assignment || assignment.status !== 'active') {
            // Assignment might have been deleted or completed early
            return;
        }

        await this.notificationService.createNotification({
            title: 'Tài sản sắp hết hạn',
            message: `Tài sản "${assetTitle}" của bạn sắp hết hạn bàn giao.`,
            type: 'Hết hạn',
            userId: userId,
            isRead: false,
        });
    }
}
