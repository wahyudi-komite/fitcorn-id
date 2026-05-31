import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  // ==================== REGION DATA (PUBLIC) ====================

  @Public()
  @Get('provinces')
  async getProvinces() {
    return this.shippingService.getProvinces();
  }

  @Public()
  @Get('cities/:provinceId')
  async getCities(@Param('provinceId') provinceId: string) {
    return this.shippingService.getCities(provinceId);
  }

  @Public()
  @Get('districts/:cityId')
  async getDistricts(@Param('cityId') cityId: string) {
    return this.shippingService.getDistricts(cityId);
  }

  @Public()
  @Get('villages/:districtId')
  async getVillages(@Param('districtId') districtId: string) {
    return this.shippingService.getVillages(districtId);
  }

  @Public()
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculateRates(@Body() body: { cityId: string; weight: number }) {
    return this.shippingService.calculateRates(body.cityId, body.weight);
  }

  // ==================== ADDRESS MANAGEMENT (AUTHENTICATED) ====================

  @Get('addresses')
  async getAddresses(@CurrentUser() user: User) {
    return this.shippingService.getAddresses(user);
  }

  @Post('addresses')
  async createAddress(
    @CurrentUser() user: User,
    @Body() body: {
      fullName: string;
      phone: string;
      province: string;
      provinceId: string;
      city: string;
      cityId: string;
      district: string;
      village: string;
      postalCode: string;
      fullAddress: string;
      isDefault?: boolean;
    },
  ) {
    return this.shippingService.createAddress(user, body);
  }

  @Put('addresses/:id')
  async updateAddress(
    @CurrentUser() user: User,
    @Param('id') addressId: string,
    @Body() body: any,
  ) {
    return this.shippingService.updateAddress(addressId, user, body);
  }

  @Delete('addresses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAddress(@CurrentUser() user: User, @Param('id') addressId: string) {
    await this.shippingService.deleteAddress(addressId, user);
  }

  @Put('addresses/:id/default')
  async setDefaultAddress(@CurrentUser() user: User, @Param('id') addressId: string) {
    return this.shippingService.setDefaultAddress(addressId, user);
  }
}
