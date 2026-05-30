import { Controller, Get } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Public()
  @Get('banners')
  async getActiveBanners() {
    return this.bannersService.getActiveBanners();
  }

  @Public()
  @Get('instagram')
  async getActiveInstagramPosts() {
    return this.bannersService.getActiveInstagramPosts();
  }
}
