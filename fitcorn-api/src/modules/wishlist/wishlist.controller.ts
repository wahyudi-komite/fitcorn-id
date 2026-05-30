import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser() user: User) {
    return this.wishlistService.getWishlist(user);
  }

  @Post(':productId')
  async addItem(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlistService.addItem(user, productId);
  }

  @Delete(':productId')
  async removeItem(@CurrentUser() user: User, @Param('productId') productId: string) {
    await this.wishlistService.removeItem(user, productId);
    return { message: 'Item removed from wishlist' };
  }

  @Delete()
  async clearWishlist(@CurrentUser() user: User) {
    await this.wishlistService.clearWishlist(user);
    return { message: 'Wishlist cleared' };
  }
}
