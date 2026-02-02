import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Assignments } from './entities/assignment.entities';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  PaginationDto,
} from './assignment.dto';
import { Asset } from '../assets/entities/asset.entities';
import { Notification } from '../notifications/entities/notification.entities';
import { CreateNotificationDto } from '../notifications/notification.dto';
import { SystemLogService } from '../systemLog/systemLog.service';
import { AssetStatus, AssignmentStatus } from '../../common/enums/status.enum';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignments)
    private assignmentsRepository: Repository<Assignments>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(Notification)
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private readonly systemLogService: SystemLogService,
  ) { }
  async getAllAssignments(paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await this.assignmentsRepository.findAndCount({
      relations: ['asset', 'employee'],
      select: {
        id: true,
        status: true,
        expired_at: true,
        assigned_at: true,
        assigned_by: true,
        note: true,
        asset: {
          id: true,
          title: true,
          metadata: true,
          status: true,
        },
        employee: {
          id: true,
          name: true,
          role: true,
        },
      },
      skip,
      take: limit,
    });
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async getAssignment(id: string): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['asset', 'employee'],
      select: {
        id: true,
        status: true,
        expired_at: true,
        assigned_at: true,
        assigned_by: true,
        note: true,
        asset: {
          id: true,
          title: true,
          metadata: true,
          status: true,
        },
        employee: {
          id: true,
          name: true,
          role: true,
        },
      },
    });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    return assignment;
  }
  async getAssignmentsByUser(id: string): Promise<Assignments[]> {
    const assignments = await this.assignmentsRepository.find({
      where: { employee: { id } },
      relations: ['asset', 'employee'],
      select: {
        id: true,
        status: true,
        expired_at: true,
        assigned_at: true,
        assigned_by: true,
        note: true,
        asset: {
          id: true,
          title: true,
          metadata: true,
          status: true,
        },
        employee: {
          id: true,
          name: true,
          role: true,
        },
      },
    });
    return assignments;
  }
  async createAssignment(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignments> {
    const { asset_id } = createAssignmentDto;
    const asset = await this.assetRepository.findOne({
      where: { id: asset_id },
    });
    if (!asset) {
      throw new NotAcceptableException('Tài sản không tồn tại');
    }
    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new NotAcceptableException(
        'Tài sản này không khả dụng (đã được giao hoặc hỏng)',
      );
    }

    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    const savedAssignment = await this.assignmentsRepository.save(assignment);
    await this.updateAssetStatus(asset_id, AssetStatus.ASSIGNED);

    await this.notificationsQueue.add('new-assignment', {
      assignmentId: savedAssignment.id,
      userId: createAssignmentDto.employee_id,
      assetTitle: asset.title,
    });

    await this.systemLogService.createSystemLog({
      action: 'CREATE_ASSIGNMENT',
      targetId: savedAssignment.id,
      targetType: 'ASSIGNMENT',
      details: { description: `Cấp phát tài sản: ${asset.title}` },
    });

    // Schedule expiry notification (7 days before)
    const expiryDate = new Date(createAssignmentDto.expired_at);
    const alertDate = new Date(expiryDate);
    alertDate.setDate(alertDate.getDate() - 7); // 7 days before

    const now = new Date();
    let delay = alertDate.getTime() - now.getTime();

    // If less than 7 days remaining, schedule immediately (or small delay)
    if (delay < 0) {
      delay = 1000 * 60; // 1 minute delay if already entering warning period
    }

    await this.notificationsQueue.add(
      'expiry-notification',
      {
        assignmentId: savedAssignment.id,
        userId: createAssignmentDto.employee_id,
        assetTitle: asset.title,
        expiredAt: expiryDate.toISOString(),
      },
      { delay },
    );

    return savedAssignment;
  }
  async updateAssignment(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['asset'], // Load asset to get title for log if needed, or just log ID
    });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    await this.assignmentsRepository.update(id, updateAssignmentDto);

    await this.systemLogService.createSystemLog({
      action: 'UPDATE_ASSIGNMENT',
      targetId: id,
      targetType: 'ASSIGNMENT',
      details: { description: `Cập nhật lượt cấp phát: ${assignment.asset?.title || id}`, changes: updateAssignmentDto },
    });

    return await this.getAssignment(id);
  }

  async returnAssignment(id: string): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['asset'],
    });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    await this.assignmentsRepository.update(id, { status: AssignmentStatus.RETURNED, expired_at: new Date() });
    await this.assetRepository.update(assignment.asset_id, { status: AssetStatus.AVAILABLE });

    await this.notificationsQueue.add('return-assignment', {
      assignmentId: assignment.id,
      userId: assignment.employee_id,
      assetTitle: assignment.asset?.title,
    });

    await this.systemLogService.createSystemLog({
      action: 'RETURN_ASSIGNMENT',
      targetId: id,
      targetType: 'ASSIGNMENT',
      details: { description: `Thu hồi tài sản: ${assignment.asset?.title || id}` },
    });
    return await this.getAssignment(id);
  }

  async deleteAssignment(id: string): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['asset'],
    });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    const deletedAssignment = await this.assignmentsRepository.remove(assignment);

    await this.systemLogService.createSystemLog({
      action: 'DELETE_ASSIGNMENT',
      targetId: id,
      targetType: 'ASSIGNMENT',
      details: { description: `Thu hồi/Xóa lượt cấp phát tài sản: ${assignment.asset?.title}` },
    });

    return deletedAssignment;
  }

  private async updateAssetStatus(
    assetId: string,
    status: AssetStatus,
  ): Promise<void> {
    await this.assetRepository.update(assetId, { status });
  }

}
