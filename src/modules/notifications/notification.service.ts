import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entities';
import { CreateNotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async getAllNotifications(): Promise<Notification[]> {
    const notification = await this.notificationRepository.find();
    return notification;
  }
  async getNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotAcceptableException('Thông báo không tồn tại');
    }
    return notification;
  }
  async getNotificationByUser(id: string) {
    const notification = await this.notificationRepository.find({
      where: { userId: id },
    });
    if (notification.length === 0) {
      throw new NotAcceptableException('Không có thông báo');
    }
    return notification;
  }
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }
  async updateStatusNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotAcceptableException('Thông báo không tồn tại');
    }
    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }
  async deleleNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotAcceptableException('Thông báo không tồn tại');
    }
    return await this.notificationRepository.remove(notification);
  }
}
