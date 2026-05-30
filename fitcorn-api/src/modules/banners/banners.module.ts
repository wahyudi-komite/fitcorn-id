import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { AdminBannersController } from './admin-banners.controller';
import { Banner } from './entities/banner.entity';
import { InstagramGallery } from './entities/instagram-gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner, InstagramGallery]),
  ],
  controllers: [BannersController, AdminBannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
