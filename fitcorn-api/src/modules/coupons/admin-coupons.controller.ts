import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/coupons')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminCouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  async getAll() {
    return this.couponsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.couponsService.getById(+id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.couponsService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.couponsService.update(+id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.couponsService.delete(+id);
    return { message: 'Coupon deleted' };
  }
}
