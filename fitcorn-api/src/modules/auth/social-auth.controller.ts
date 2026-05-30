import { Controller, Get, Post, Body, Req, Res, UseGuards, Query, Logger, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SocialAuthService } from './social-auth.service';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class SocialAuthController {
  private readonly logger = new Logger(SocialAuthController.name);

  constructor(
    private socialAuthService: SocialAuthService,
    private configService: ConfigService,
    @Inject(InstagramStrategy) private instagramStrategy: InstagramStrategy,
  ) {}

  // ─── OAuth Redirects ─────────────────────────────────────────

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    return this.handleOAuthCallback(req, res, 'google');
  }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {}

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: any, @Res() res: any) {
    return this.handleOAuthCallback(req, res, 'facebook');
  }

  @Public()
  @Get('instagram')
  instagramAuth(@Res() res: any, @Query('state') state: string) {
    if (this.configService.get<string>('app.instagram.clientId')) {
      const stateParam = state || Math.random().toString(36).substring(2);
      const url = this.instagramStrategy.getAuthorizeUrl(stateParam);
      return res.redirect(url);
    }
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    return res.redirect(`${frontendUrl}/masuk?error=instagram_not_configured`);
  }

  @Public()
  @Get('instagram/callback')
  async instagramCallback(@Req() req: any, @Res() res: any) {
    try {
      const profile = await this.instagramStrategy.validate(req);
      const result = await this.socialAuthService.validateOAuthUser(profile);
      return this.redirectWithTokens(res, result);
    } catch (err: any) {
      this.logger.error('Instagram OAuth error', err.message);
      const frontendUrl = this.configService.get<string>('app.frontendUrl');
      return res.redirect(`${frontendUrl}/masuk?error=instagram_auth_failed`);
    }
  }

  // ─── Phone / WhatsApp OTP ────────────────────────────────────

  @Public()
  @Post('phone/send-otp')
  async sendOtp(@Body('phone') phone: string) {
    return this.socialAuthService.sendOtp(phone);
  }

  @Public()
  @Post('phone/verify-otp')
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    const result = await this.socialAuthService.verifyOtp(phone, otp);
    return result;
  }

  // ─── Helpers ──────────────────────────────────────────────────

  private async handleOAuthCallback(req: any, res: any, provider: string) {
    try {
      const profile = req.user;
      const result = await this.socialAuthService.validateOAuthUser(profile);
      return this.redirectWithTokens(res, result);
    } catch (err: any) {
      this.logger.error(`${provider} OAuth error`, err.message);
      const frontendUrl = this.configService.get<string>('app.frontendUrl');
      return res.redirect(`${frontendUrl}/masuk?error=${provider}_auth_failed`);
    }
  }

  private redirectWithTokens(res: any, result: { accessToken: string; refreshToken: string; user: any }) {
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const userEncoded = encodeURIComponent(JSON.stringify(result.user));
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('app.nodeEnv') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}&user=${userEncoded}`);
  }
}
