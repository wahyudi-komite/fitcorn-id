import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getCart(user?: User, sessionId?: string): Promise<Cart> {
    if (!user && !sessionId) {
      throw new BadRequestException('Either User or Session ID is required to get a cart');
    }

    let cart: Cart | null = null;

    if (user) {
      cart = await this.cartRepository.findOne({
        where: { user: { id: user.id } },
        relations: {
          items: {
            product: {
              images: true,
            },
            variant: true,
          },
        },
      });

      if (!cart) {
        cart = this.cartRepository.create({ user });
        await this.cartRepository.save(cart);
      }
    } else {
      cart = await this.cartRepository.findOne({
        where: { sessionId },
        relations: {
          items: {
            product: {
              images: true,
            },
            variant: true,
          },
        },
      });

      if (!cart) {
        cart = this.cartRepository.create({ sessionId });
        await this.cartRepository.save(cart);
      }
    }

    return cart!;
  }

  async addItem(
    payload: { productId: string; variantId?: string; quantity: number },
    user?: User,
    sessionId?: string,
  ): Promise<Cart> {
    const { productId, variantId, quantity } = payload;
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.getCart(user, sessionId);

    // Validate product existence
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
      relations: { inventory: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found or inactive');
    }

    // Validate variant if provided
    let variant: ProductVariant | null = null;
    if (variantId) {
      variant = await this.variantRepository.findOne({
        where: { id: variantId, product: { id: productId } },
        relations: { inventory: true },
      });

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }
    }

    // Check inventory
    const inventory = variant ? variant.inventory : product.inventory;
    const availableQty = inventory ? inventory.quantity - inventory.reserved : 0;

    // Check if item already exists in cart
    let cartItem = cart.items.find(
      (item) =>
        item.product.id === productId &&
        (!variantId || (item.variant && item.variant.id === variantId)),
    );

    const newQty = cartItem ? cartItem.quantity + quantity : quantity;

    if (availableQty < newQty) {
      throw new BadRequestException(
        `Insufficient stock. Only ${availableQty} items available, you have requested ${newQty} in total`,
      );
    }

    if (cartItem) {
      cartItem.quantity = newQty;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        variant: variant || undefined,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(user, sessionId);
  }

  async updateItemQuantity(
    itemId: number,
    quantity: number,
    user?: User,
    sessionId?: string,
  ): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeItem(itemId, user, sessionId);
    }

    const cart = await this.getCart(user, sessionId);
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found in your cart');
    }

    // Check inventory
    const product = await this.productRepository.findOne({
      where: { id: cartItem.product.id },
      relations: { inventory: true },
    });

    let variant: ProductVariant | null = null;
    if (cartItem.variant) {
      variant = await this.variantRepository.findOne({
        where: { id: cartItem.variant.id },
        relations: { inventory: true },
      });
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const inventory = variant ? variant.inventory : product.inventory;
    const availableQty = inventory ? inventory.quantity - inventory.reserved : 0;

    if (availableQty < quantity) {
      throw new BadRequestException(`Insufficient stock. Only ${availableQty} items available.`);
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCart(user, sessionId);
  }

  async removeItem(itemId: number, user?: User, sessionId?: string): Promise<Cart> {
    const cart = await this.getCart(user, sessionId);
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found in your cart');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getCart(user, sessionId);
  }

  async clearCart(user?: User, sessionId?: string): Promise<void> {
    const cart = await this.getCart(user, sessionId);
    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }
  }

  // Merge guest cart with user cart upon login
  async mergeCarts(userId: string, sessionId: string): Promise<Cart> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const guestCart = await this.cartRepository.findOne({
      where: { sessionId },
      relations: {
        items: {
          product: true,
          variant: true,
        },
      },
    });

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return this.getCart(user);
    }

    const userCart = await this.getCart(user);

    for (const guestItem of guestCart.items) {
      let userItem = userCart.items.find(
        (item) =>
          item.product.id === guestItem.product.id &&
          (!guestItem.variant || (item.variant && item.variant.id === guestItem.variant.id)),
      );

      if (userItem) {
        userItem.quantity += guestItem.quantity;
        await this.cartItemRepository.save(userItem);
      } else {
        const newItem = this.cartItemRepository.create({
          cart: userCart,
          product: guestItem.product,
          variant: guestItem.variant,
          quantity: guestItem.quantity,
        });
        await this.cartItemRepository.save(newItem);
      }
    }

    // Delete guest cart items and guest cart
    await this.cartItemRepository.remove(guestCart.items);
    await this.cartRepository.remove(guestCart);

    return this.getCart(user);
  }
}
