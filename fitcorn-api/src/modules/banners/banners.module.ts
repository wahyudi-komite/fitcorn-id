import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { Banner } from './entities/banner.entity';
import { InstagramGallery } from './entities/instagram-gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner, InstagramGallery]),
  ],
  controllers: [BannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
