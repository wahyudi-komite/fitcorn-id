import { Injectable, BadRequestException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
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

    // 2. Seed Admin User
    const adminUser = await this.userRepository.findOne({ where: { email: 'admin@fitcorn.com' } });
    if (!adminUser) {
      console.log('Seeding default administrator credentials in database...');
      
      const hashedPassword = await bcrypt.hash('AdminFitcorn2026!', 10);
      const newAdmin = this.userRepository.create({
        email: 'admin@fitcorn.com',
        password: hashedPassword,
        fullName: 'Fitcorn Administrator',
        phone: '081234567890',
        isActive: true,
        roles: [adminRole]
      });

      await this.userRepository.save(newAdmin);
      console.log('Administrator seed credentials saved successfully: admin@fitcorn.com / AdminFitcorn2026!');
    }
  }


  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, fullName, phone } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Find customer role or create one if not exists (for seeding purposes)
    let customerRole = await this.roleRepository.findOne({ where: { name: 'customer' } });
    if (!customerRole) {
      customerRole = this.roleRepository.create({ name: 'customer', description: 'Customer role' });
      await this.roleRepository.save(customerRole);
    }

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
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

    const isPasswordValid = await bcrypt.compare(password, user.password!);
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
