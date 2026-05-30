import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/customers')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.fullName = Like(`%${search}%`);
      // Or search email
    }

    const [data, total] = await this.userRepository.findAndCount({
      where: search
        ? [
            { fullName: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
          ]
        : {},
      relations: { roles: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    // Strip passwords before returning
    data.forEach((user) => {
      delete user.password;
      delete user.refreshToken;
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: true, orders: true, addresses: true },
    });

    if (!user) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    delete user.password;
    delete user.refreshToken;

    return user;
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    user.isActive = isActive;
    await this.userRepository.save(user);

    delete user.password;
    delete user.refreshToken;

    return {
      message: `Customer status updated to ${isActive ? 'active' : 'inactive'}`,
      user,
    };
  }
}
