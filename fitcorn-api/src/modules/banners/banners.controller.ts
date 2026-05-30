import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class BannersController {
  constructor(private bannersService: BannersService) {}

  // ==================== BANNERS ====================

  @Public()
  @Get('banners')
  async getActiveBanners() {
    return this.bannersService.getActiveBanners();
  }

  @Get('admin/banners')
  async getAllBanners() {
    return this.bannersService.getAllBanners();
  }

  @Get('admin/banners/:id')
  async getBanner(@Param('id') id: string) {
    return this.bannersService.getBanner(+id);
  }

  @Post('admin/banners')
  async createBanner(@Body() data: any) {
    return this.bannersService.createBanner(data);
  }

  @Put('admin/banners/:id')
  async updateBanner(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.updateBanner(+id, data);
  }

  @Delete('admin/banners/:id')
  async deleteBanner(@Param('id') id: string) {
    await this.bannersService.deleteBanner(+id);
    return { message: 'Banner deleted' };
  }

  // ==================== INSTAGRAM GALLERY ====================

  @Public()
  @Get('instagram')
  async getActiveInstagramPosts() {
    return this.bannersService.getActiveInstagramPosts();
  }

  @Get('admin/instagram')
  async getAllInstagramPosts() {
    return this.bannersService.getAllInstagramPosts();
  }

  @Post('admin/instagram')
  async createInstagramPost(@Body() data: any) {
    return this.bannersService.createInstagramPost(data);
  }

  @Put('admin/instagram/:id')
  async updateInstagramPost(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.updateInstagramPost(+id, data);
  }

  @Delete('admin/instagram/:id')
  async deleteInstagramPost(@Param('id') id: string) {
    await this.bannersService.deleteInstagramPost(+id);
    return { message: 'Instagram post deleted' };
  }
}
