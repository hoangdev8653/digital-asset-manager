import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Put,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginDto);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Đăng nhập thành công',
      access_token,
      refresh_token,
      user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Đăng xuất thành công' };
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    const refresh_token = request.cookies['refresh_token'] as string;
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const { access_token } = await this.authService.refresh(refresh_token);
    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = req.user as User;
    return this.authService.changePassword(user, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const user = req.user as User;
    return this.authService.resetPassword(user, resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('lock-account')
  async lockAccount(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.lockAccount(user);
  }
}
