import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  async getAllNotifications() {
    const notifications = await this.notificationService.getAllNotifications();
    return {
      message: 'Lấy danh sách thông báo thành công',
      data: notifications,
    };
  }
  @Get(':id')
  async getNotification(@Param('id') id: string) {
    const notification = await this.notificationService.getNotification(id);
    return {
      message: 'Lấy thông báo thành công',
      data: notification,
    };
  }
  @Post('')
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const notification = await this.notificationService.createNotification(
      createNotificationDto,
    );
    return {
      message: 'Tạo thông báo thành công',
      data: notification,
    };
  }
  @Put(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    const notification = await this.notificationService.updateNotification(
      id,
      updateNotificationDto,
    );
    return {
      message: 'Cập nhật thông báo thành công',
      data: notification,
    };
  }
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    const notification = await this.notificationService.deleleNotification(id);
    return {
      message: 'Xóa thông báo thành công',
      data: notification,
    };
  }
}
