import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  // ==================== AUTHENTICATED CART ENDPOINTS ====================

  @Get()
  async getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user);
  }

  @Post('items')
  async addItem(
    @CurrentUser() user: User,
    @Body() body: { productId: string; variantId?: string; quantity: number },
  ) {
    return this.cartService.addItem(body, user);
  }

  @Put('items/:id')
  async updateItemQuantity(
    @CurrentUser() user: User,
    @Param('id') itemId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(itemId, quantity, user);
  }

  @Delete('items/:id')
  async removeItem(@CurrentUser() user: User, @Param('id') itemId: number) {
    return this.cartService.removeItem(itemId, user);
  }

  @Delete()
  async clearCart(@CurrentUser() user: User) {
    await this.cartService.clearCart(user);
    return { message: 'Cart cleared successfully' };
  }

  // ==================== GUEST CART ENDPOINTS ====================

  @Public()
  @Get('guest')
  async getGuestCart(@Headers('x-session-id') sessionId: string) {
    return this.cartService.getCart(undefined, sessionId);
  }

  @Public()
  @Post('guest/items')
  async addGuestItem(
    @Headers('x-session-id') sessionId: string,
    @Body() body: { productId: string; variantId?: string; quantity: number },
  ) {
    return this.cartService.addItem(body, undefined, sessionId);
  }

  @Public()
  @Put('guest/items/:id')
  async updateGuestItemQuantity(
    @Headers('x-session-id') sessionId: string,
    @Param('id') itemId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(itemId, quantity, undefined, sessionId);
  }

  @Public()
  @Delete('guest/items/:id')
  async removeGuestItem(@Headers('x-session-id') sessionId: string, @Param('id') itemId: number) {
    return this.cartService.removeItem(itemId, undefined, sessionId);
  }

  @Public()
  @Delete('guest')
  async clearGuestCart(@Headers('x-session-id') sessionId: string) {
    await this.cartService.clearCart(undefined, sessionId);
    return { message: 'Guest cart cleared successfully' };
  }

  @Post('merge')
  async mergeCarts(
    @CurrentUser('id') userId: string,
    @Headers('x-session-id') sessionId: string,
  ) {
    return this.cartService.mergeCarts(userId, sessionId);
  }
}
