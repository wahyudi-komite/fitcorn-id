import { Injectable, BadRequestException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    // 1. Seed Roles
    let adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = this.roleRepository.create({ name: 'admin', description: 'Fitcorn Head Administrator' });
      adminRole = await this.roleRepository.save(adminRole);
    }

    let customerRole = await this.roleRepository.findOne({ where: { name: 'customer' } });
    if (!customerRole) {
      customerRole = this.roleRepository.create({ name: 'customer', description: 'Standard Popcorn Shopper' });
      await this.roleRepository.save(customerRole);
    }

    // 2. Seed/Upsert Admin Password
    const adminSalt = randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash('12345678' + adminSalt, 10);

    const adminUser = await this.userRepository.findOne({
      where: { email: 'admin@fitcorn.com' },
      select: { id: true, password: true, salt: true },
    });

    if (!adminUser) {
      console.log('Seeding default administrator...');

      const newAdmin = this.userRepository.create({
        email: 'admin@fitcorn.com',
        password: hashedPassword,
        salt: adminSalt,
        fullName: 'Fitcorn Administrator',
        phone: '081234567890',
        isActive: true,
        roles: [adminRole]
      });

      await this.userRepository.save(newAdmin);
      console.log('Admin created: admin@fitcorn.com / 12345678');
    } else {
      await this.userRepository.update(adminUser.id, {
        password: hashedPassword,
        salt: adminSalt,
      });
      console.log('Admin password updated: admin@fitcorn.com / 12345678');
    }
  }


  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, fullName, phone } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const salt = randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    // Find customer role or create one if not exists (for seeding purposes)
    let customerRole = await this.roleRepository.findOne({ where: { name: 'customer' } });
    if (!customerRole) {
      customerRole = this.roleRepository.create({ name: 'customer', description: 'Customer role' });
      await this.roleRepository.save(customerRole);
    }

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      salt,
      fullName,
      phone,
      roles: [customerRole],
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        salt: true,
        fullName: true,
        phone: true,
        avatar: true,
        isActive: true,
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password + user.salt!, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Remove password from returned user object
    delete (user as any).password;

    return {
      ...tokens,
      user,
    };
  }

  async refresh(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
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
