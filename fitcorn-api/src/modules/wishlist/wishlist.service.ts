import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getWishlist(user: User): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { user: { id: user.id } },
      relations: { product: { images: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async addItem(user: User, productId: string): Promise<Wishlist> {
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found or inactive');
    }

    const existing = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });
    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    const item = this.wishlistRepository.create({ user, product });
    return this.wishlistRepository.save(item);
  }

  async removeItem(user: User, productId: string): Promise<void> {
    const item = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });
    if (!item) {
      throw new NotFoundException('Wishlist item not found');
    }
    await this.wishlistRepository.remove(item);
  }

  async clearWishlist(user: User): Promise<void> {
    const items = await this.wishlistRepository.find({
      where: { user: { id: user.id } },
    });
    if (items.length > 0) {
      await this.wishlistRepository.remove(items);
    }
  }
}
