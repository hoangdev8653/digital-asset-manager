import {
  Controller,
  Get,
  Delete,
  Param,
  Put,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../users/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return {
      message: 'Lấy danh sách người dùng thành công',
      data: users,
    };
  }
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    return {
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(id, updateUserDto);
    return {
      message: 'Cập nhật thông tin người dùng thành công',
      data: user,
    };
  }
  @Patch(':id/lock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async lockAccount(@Param('id') id: string) {
    const user = await this.userService.lockAccount(id);
    return {
      message: 'Khóa tài khoản người dùng thành công',
      data: user,
    };
  }
  @Patch(':id/unlock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async unlockAccount(@Param('id') id: string) {
    const user = await this.userService.unlockAccount(id);
    return {
      message: 'Mở khóa tài khoản người dùng thành công',
      data: user,
    };
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id);
    return {
      message: 'Xóa người dùng thành công',
      data: user,
    };
  }
}
