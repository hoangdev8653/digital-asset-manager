import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entities';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './notification.dto';

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
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }
  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotAcceptableException('Thông báo không tồn tại');
    }
    const updatedNotification = Object.assign(
      notification,
      updateNotificationDto,
    );
    return await this.notificationRepository.save(updatedNotification);
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
