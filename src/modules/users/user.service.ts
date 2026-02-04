import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from './entities/user.entities';
import { UpdateUserDto, PaginationDto } from './user.dto';
import { SystemLogService } from '../systemLog/systemLog.service';
import { UserStatus } from '../../common/enums/status.enum';
import { GrowthStatistics, calculateGrowthRate, getMonthComparisonRanges } from "../../utils/statistics.util"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly systemLogService: SystemLogService,
  ) { }

  async getAllUsers(paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });
    data.forEach((user: any) => delete user.password);

    const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } = getMonthComparisonRanges()
    const currentMonth = await this.userRepository.count({
      where: {
        created_at: Between(currentMonthStart, currentMonthEnd)
      },
    })
    const lastMonth = await this.userRepository.count({
      where: {
        created_at: Between(lastMonthStart, lastMonthEnd)
      },
    })
    const growthRate = calculateGrowthRate(currentMonth, lastMonth)
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      growthRate,
    }
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      delete (user as any).password;
    }
    return user;
  }

  async getAdmins(): Promise<User[]> {
    return this.userRepository.find({ where: { role: 'ADMIN' } });
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      delete (user as any).password;
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.merge(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    delete (updatedUser as any).password;
    return updatedUser;
  }

  async lockAccount(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.status === UserStatus.INACTIVE) {
      return user;
    }
    const updatedUser = this.userRepository.merge(user, { status: UserStatus.INACTIVE });
    const savedUser = await this.userRepository.save(updatedUser);

    await this.systemLogService.createSystemLog({
      action: 'LOCK_ACCOUNT',
      targetId: savedUser.id,
      targetType: 'USER',
      details: { description: `Khóa tài khoản: ${savedUser.email}` },
    });

    return savedUser;
  }

  async unlockAccount(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.status === UserStatus.ACTIVE) {
      return user;
    }
    const updatedUser = this.userRepository.merge(user, { status: UserStatus.ACTIVE });
    const savedUser = await this.userRepository.save(updatedUser);

    await this.systemLogService.createSystemLog({
      action: 'UNLOCK_ACCOUNT',
      targetId: savedUser.id,
      targetType: 'USER',
      details: { description: `Mở khóa tài khoản: ${savedUser.email}` },
    });

    return savedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.userRepository.remove(user);

      await this.systemLogService.createSystemLog({
        action: 'DELETE_USER',
        targetId: id,
        targetType: 'USER',
        details: { description: `Xóa tài khoản người dùng: ${user.email}` },
      });
    }
    return user;
  }
}
