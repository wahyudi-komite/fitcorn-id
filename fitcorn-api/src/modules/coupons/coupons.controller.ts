import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post('coupons/validate')
  async validate(@Body() body: { code: string; subtotal: number }) {
    return this.couponsService.validate(body.code, body.subtotal);
  }

  @Get('admin/coupons')
  async getAll() {
    return this.couponsService.getAll();
  }

  @Get('admin/coupons/:id')
  async getById(@Param('id') id: string) {
    return this.couponsService.getById(+id);
  }

  @Post('admin/coupons')
  async create(@Body() data: any) {
    return this.couponsService.create(data);
  }

  @Put('admin/coupons/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.couponsService.update(+id, data);
  }

  @Delete('admin/coupons/:id')
  async delete(@Param('id') id: string) {
    await this.couponsService.delete(+id);
    return { message: 'Coupon deleted' };
  }
}
