import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';

interface OAuthProfile {
  provider: 'google' | 'facebook' | 'instagram';
  providerId: string;
  email: string;
  fullName: string;
  avatar?: string;
}

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);
  private otpStore = new Map<string, { otp: string; expiresAt: Date }>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateOAuthUser(profile: OAuthProfile): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const providerField = profile.provider === 'google' ? 'googleId'
      : profile.provider === 'facebook' ? 'facebookId'
      : 'instagramId';

    let user = await this.userRepository.findOne({
      where: { [providerField]: profile.providerId },
      relations: { roles: { permissions: true } },
    });

    if (!user && profile.email) {
      user = await this.userRepository.findOne({
        where: { email: profile.email },
        relations: { roles: { permissions: true } },
      });
      if (user) {
        (user as any)[providerField] = profile.providerId;
        if (!user.avatar && profile.avatar) user.avatar = profile.avatar;
        await this.userRepository.save(user);
      }
    }

    if (!user) {
      let customerRole = await this.roleRepository.findOne({ where: { name: 'customer' } });
      if (!customerRole) {
        customerRole = this.roleRepository.create({ name: 'customer', description: 'Customer role' });
        await this.roleRepository.save(customerRole);
      }

      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = this.userRepository.create({
        email: profile.email || `${profile.providerId}@${profile.provider}.fitcorn`,
        password: randomPassword,
        fullName: profile.fullName,
        avatar: profile.avatar,
        roles: [customerRole],
        [providerField]: profile.providerId,
      });
      user = await this.userRepository.save(user);
      user.roles = [customerRole];
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const result = { ...user } as any;
    delete result.password;
    delete result.refreshToken;

    return { ...tokens, user: result };
  }

  async sendOtp(phone: string): Promise<{ message: string }> {
    const normalized = phone.replace(/[^0-9]/g, '');
    if (normalized.length < 10) {
      throw new BadRequestException('Invalid phone number');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + (this.configService.get<number>('app.whatsapp.otpExpiryMinutes') || 5) * 60 * 1000);
    this.otpStore.set(normalized, { otp, expiresAt });

    // In dev: log OTP to console
    this.logger.log(`OTP for ${normalized}: ${otp}`);

    // Attempt to send via WhatsApp gateway if configured
    const gateway = this.configService.get<string>('app.whatsapp.gatewayUrl');
    if (gateway) {
      // const token = this.configService.get<string>('app.whatsapp.token');
      // await axios.post(`${gateway}/send`, { phone, message: `Your Fitcorn OTP: ${otp}` });
      this.logger.log(`WhatsApp gateway configured at ${gateway} — OTP would be sent`);
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const normalized = phone.replace(/[^0-9]/g, '');
    const stored = this.otpStore.get(normalized);

    if (!stored) {
      throw new BadRequestException('No OTP requested for this number');
    }

    if (new Date() > stored.expiresAt) {
      this.otpStore.delete(normalized);
      throw new BadRequestException('OTP has expired');
    }

    if (stored.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    this.otpStore.delete(normalized);

    let user = await this.userRepository.findOne({
      where: { phone: normalized },
      relations: { roles: { permissions: true } },
    });

    if (!user) {
      let customerRole = await this.roleRepository.findOne({ where: { name: 'customer' } });
      if (!customerRole) {
        customerRole = this.roleRepository.create({ name: 'customer', description: 'Customer role' });
        await this.roleRepository.save(customerRole);
      }

      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = this.userRepository.create({
        email: `${normalized}@phone.fitcorn`,
        password: randomPassword,
        fullName: `User ${normalized.slice(-4)}`,
        phone: normalized,
        phoneVerified: true,
        roles: [customerRole],
      });
      user = await this.userRepository.save(user);
      user.roles = [customerRole];
    } else if (!user.phoneVerified) {
      user.phoneVerified = true;
      await this.userRepository.save(user);
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const result = { ...user } as any;
    delete result.password;
    delete result.refreshToken;

    return { ...tokens, user: result };
  }

  async getOAuthUrls(): Promise<Record<string, string | null>> {
    const base = this.configService.get<string>('app.frontendUrl');
    return {
      google: this.configService.get<string>('app.google.clientId')
        ? `${base}/api/auth/google` : null,
      facebook: this.configService.get<string>('app.facebook.clientId')
        ? `${base}/api/auth/facebook` : null,
      instagram: this.configService.get<string>('app.instagram.clientId')
        ? `${base}/api/auth/instagram` : null,
    };
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }
}
