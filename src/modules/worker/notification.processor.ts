import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationService } from '../notifications/notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignments } from '../assignments/entities/assignment.entities';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { AssignmentStatus } from '../../common/enums/status.enum';

@Processor('notifications')
export class AssignmentProcessor extends WorkerHost {
    constructor(
        private readonly notificationService: NotificationService,
        @InjectRepository(Assignments)
        private readonly assignmentsRepository: Repository<Assignments>,
        private readonly userService: UserService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'new-assignment':
                await this.handleNewAssignment(job.data);
                break;
            case 'expiry-notification':
                await this.handleExpiryNotification(job.data);
                break;
            case 'return-assignment':
                await this.handleReturnAssignment(job.data);
                break;
            default:
                console.warn(`Unknown job name: ${job.name}`);
        }
    }

    private async handleNewAssignment(data: {
        assignmentId: string;
        userId: string;
        assetTitle: string;
    }) {
        await this.notificationService.createNotification({
            title: 'Cấp tài sản',
            isRead: false,
            type: 'Cấp tài sản',
            message: `Bạn vừa được cấp tài sản: ${data.assetTitle}`,
            userId: data.userId,
        });
    }

    private async handleExpiryNotification(data: {
        assignmentId: string;
        userId: string;
        assetTitle: string;
        expiredAt: string;
    }) {
        const { assignmentId, userId, assetTitle, expiredAt } = data;

        // Double check if assignment is still valid (not deleted or returned)
        const assignment = await this.assignmentsRepository.findOne({
            where: { id: assignmentId },
        });

        if (!assignment || assignment.status !== AssignmentStatus.ACTIVE) {
            return;
        }

        const dateStr = new Date(expiredAt).toLocaleDateString('vi-VN');

        // 1. Notify Employee
        await this.notificationService.createNotification({
            title: 'Sắp hết hạn',
            message: `Tài sản "${assetTitle}" sẽ hết hạn vào ngày ${dateStr}. Vui lòng chuẩn bị bàn giao.`,
            type: 'Hết hạn',
            userId: userId,
            isRead: false,
        });

        // 2. Notify Admins
        const admins = await this.userService.getAdmins();
        for (const admin of admins) {
            await this.notificationService.createNotification({
                title: 'Cảnh báo hết hạn',
                message: `Tài sản "${assetTitle}" (Nhân viên: ${userId}) sắp hết hạn vào ${dateStr}.`,
                type: 'Hết hạn',
                userId: admin.id,
                isRead: false,
            });
        }
    }

    private async handleReturnAssignment(data: {
        assignmentId: string;
        userId: string;
        assetTitle: string;
    }) {
        await this.notificationService.createNotification({
            title: 'Thu hồi tài sản',
            isRead: false,
            type: 'Thu hồi tài sản',
            message: `Tài sản ${data.assetTitle} đã được thu hồi`,
            userId: data.userId,
        });
    }
}
