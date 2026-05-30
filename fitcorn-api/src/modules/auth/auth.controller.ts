import { Controller, Post, Body, Res, UseGuards, Get, Req, HttpCode, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: express.Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(response, refreshToken);
    return { accessToken, user };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: User, @Res({ passthrough: true }) response: express.Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(user);
    this.setRefreshTokenCookie(response, refreshToken);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: string, @Res({ passthrough: true }) response: express.Response) {
    await this.authService.logout(userId);
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get<string>('app.nodeEnv') === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  private setRefreshTokenCookie(response: express.Response, refreshToken: string) {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('app.nodeEnv') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matches config
    });
  }
}
