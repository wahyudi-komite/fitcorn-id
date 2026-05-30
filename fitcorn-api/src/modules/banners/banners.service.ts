import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { InstagramGallery } from './entities/instagram-gallery.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(InstagramGallery)
    private instagramRepository: Repository<InstagramGallery>,
  ) {}

  // ==================== BANNERS ====================

  async getActiveBanners(): Promise<Banner[]> {
    const now = new Date();
    return this.bannerRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getAllBanners(): Promise<Banner[]> {
    return this.bannerRepository.find({ order: { sortOrder: 'ASC' } });
  }

  async getBanner(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async createBanner(data: Partial<Banner>): Promise<Banner> {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async updateBanner(id: number, data: Partial<Banner>): Promise<Banner> {
    const banner = await this.getBanner(id);
    Object.assign(banner, data);
    return this.bannerRepository.save(banner);
  }

  async deleteBanner(id: number): Promise<void> {
    const banner = await this.getBanner(id);
    await this.bannerRepository.remove(banner);
  }

  // ==================== INSTAGRAM GALLERY ====================

  async getActiveInstagramPosts(): Promise<InstagramGallery[]> {
    return this.instagramRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getAllInstagramPosts(): Promise<InstagramGallery[]> {
    return this.instagramRepository.find({ order: { sortOrder: 'ASC' } });
  }

  async createInstagramPost(data: Partial<InstagramGallery>): Promise<InstagramGallery> {
    const post = this.instagramRepository.create(data);
    return this.instagramRepository.save(post);
  }

  async updateInstagramPost(id: number, data: Partial<InstagramGallery>): Promise<InstagramGallery> {
    const post = await this.instagramRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Instagram post not found');
    Object.assign(post, data);
    return this.instagramRepository.save(post);
  }

  async deleteInstagramPost(id: number): Promise<void> {
    const post = await this.instagramRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Instagram post not found');
    await this.instagramRepository.remove(post);
  }
}
