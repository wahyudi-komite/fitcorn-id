import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminBannersController {
  constructor(private bannersService: BannersService) {}

  @Get('banners')
  async getAllBanners() {
    return this.bannersService.getAllBanners();
  }

  @Get('banners/:id')
  async getBanner(@Param('id') id: string) {
    return this.bannersService.getBanner(+id);
  }

  @Post('banners')
  async createBanner(@Body() data: any) {
    return this.bannersService.createBanner(data);
  }

  @Put('banners/:id')
  async updateBanner(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.updateBanner(+id, data);
  }

  @Delete('banners/:id')
  async deleteBanner(@Param('id') id: string) {
    await this.bannersService.deleteBanner(+id);
    return { message: 'Banner deleted' };
  }

  @Get('instagram')
  async getAllInstagramPosts() {
    return this.bannersService.getAllInstagramPosts();
  }

  @Post('instagram')
  async createInstagramPost(@Body() data: any) {
    return this.bannersService.createInstagramPost(data);
  }

  @Put('instagram/:id')
  async updateInstagramPost(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.updateInstagramPost(+id, data);
  }

  @Delete('instagram/:id')
  async deleteInstagramPost(@Param('id') id: string) {
    await this.bannersService.deleteInstagramPost(+id);
    return { message: 'Instagram post deleted' };
  }
}
