import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async validate(code: string, subtotal: number): Promise<any> {
    const coupon = await this.couponRepository.findOne({ where: { code, isActive: true } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found or inactive');
    }

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      throw new BadRequestException('Coupon is not yet active');
    }
    if (coupon.endDate && now > coupon.endDate) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (subtotal < coupon.minPurchase) {
      throw new BadRequestException(
        `Minimum purchase of ${coupon.minPurchase} required for this coupon`,
      );
    }

    let discount = coupon.type === 'percentage'
      ? (subtotal * coupon.value) / 100
      : coupon.value;

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    await this.couponRepository.increment({ id: coupon.id }, 'usedCount', 1);

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      remaining: coupon.usageLimit ? coupon.usageLimit - coupon.usedCount - 1 : null,
    };
  }

  async getAll(): Promise<Coupon[]> {
    return this.couponRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getById(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async create(data: Partial<Coupon>): Promise<Coupon> {
    const coupon = this.couponRepository.create(data);
    return this.couponRepository.save(coupon);
  }

  async update(id: number, data: Partial<Coupon>): Promise<Coupon> {
    const coupon = await this.getById(id);
    Object.assign(coupon, data);
    return this.couponRepository.save(coupon);
  }

  async delete(id: number): Promise<void> {
    const coupon = await this.getById(id);
    await this.couponRepository.remove(coupon);
  }
}
