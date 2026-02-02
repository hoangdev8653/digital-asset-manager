import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.dto';
import { SystemLogService } from '../systemLog/systemLog.service';
import { UserStatus } from '../../common/enums/status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly systemLogService: SystemLogService,
  ) { }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, name } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const data = await this.userRepository.save(user);

    await this.systemLogService.createSystemLog({
      action: 'REGISTER',
      targetId: data.id,
      targetType: 'USER',
      details: { description: `Đăng ký tài khoản mới: ${data.email}` },
    });

    return data;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { access_token, refresh_token, user };
  }

  async refresh(refresh_token: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refresh_token,
      );
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const new_access_token = this.jwtService.sign({
        email: user.email,
        sub: user.id,
      });
      return { access_token: new_access_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedNewPassword });
    return { message: 'Password changed successfully' };
  }

  async resetPassword(
    user: User,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { newPassword } = resetPasswordDto;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedNewPassword });

    await this.systemLogService.createSystemLog({
      action: 'RESET_PASSWORD',
      targetId: user.id,
      targetType: 'USER',
      details: { description: `Đặt lại mật khẩu cho tài khoản: ${user.email}` },
    });

    return { message: 'Password reset successfully' };
  }

  async lockAccount(
    user: User,
  ): Promise<{ message: string }> {
    await this.userRepository.update(user.id, { status: UserStatus.INACTIVE });

    await this.systemLogService.createSystemLog({
      action: 'LOCK_ACCOUNT',
      targetId: user.id,
      targetType: 'USER',
      details: { email: user.email, reason: 'Action performed' },
    });

    return { message: 'Account locked successfully' };
  }

  async unLockAccount(
    user: User,
  ): Promise<{ message: string }> {
    await this.userRepository.update(user.id, { status: UserStatus.ACTIVE });

    await this.systemLogService.createSystemLog({
      action: 'UNLOCK_ACCOUNT',
      targetId: user.id,
      targetType: 'USER',
      details: { email: user.email },
    });

    return { message: 'Account unlocked successfully' };
  }
}
