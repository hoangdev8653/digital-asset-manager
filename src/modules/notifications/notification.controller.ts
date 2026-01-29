import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notification.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

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
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getNotificationByUser(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    const notifications =
      await this.notificationService.getNotificationByUser(userId);
    return {
      message: 'Lấy Danh sách thông báo',
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
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateStatusNotification(@Param('id') id: string) {
    const notification =
      await this.notificationService.updateStatusNotification(id);
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
