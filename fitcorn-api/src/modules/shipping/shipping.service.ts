import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Courier } from './entities/courier.entity';
import { RajaOngkirProvider } from './providers/rajaongkir.provider';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingAddress)
    private addressRepository: Repository<ShippingAddress>,
    @InjectRepository(Courier)
    private courierRepository: Repository<Courier>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rajaOngkirProvider: RajaOngkirProvider,
  ) {}

  // ==================== RAJAONGKIR PROXY METHODEN ====================

  async getProvinces() {
    return this.rajaOngkirProvider.getProvinces();
  }

  async getCities(provinceId: string) {
    return this.rajaOngkirProvider.getCities(provinceId);
  }

  async calculateRates(destinationCityId: string, totalWeightGrams: number) {
    // Get all active couriers in DB
    const activeCouriers = await this.courierRepository.find({
      where: { isActive: true },
    });

    if (activeCouriers.length === 0) {
      throw new BadRequestException('No active couriers available in database');
    }

    const ratesPromises = activeCouriers.map(async (courier) => {
      try {
        const rates = await this.rajaOngkirProvider.calculateRates(
          '501', // Yogyakarta (Fitcorn origin)
          destinationCityId,
          totalWeightGrams,
          courier.code,
        );

        return {
          courierId: courier.id,
          courierCode: courier.code,
          courierName: courier.name,
          logo: courier.logo,
          rates: rates.map((r) => ({
            service: r.service,
            description: r.description,
            cost: r.cost,
            etd: r.etd,
          })),
        };
      } catch (error) {
        return {
          courierId: courier.id,
          courierCode: courier.code,
          courierName: courier.name,
          logo: courier.logo,
          rates: [],
        };
      }
    });

    return Promise.all(ratesPromises);
  }

  // ==================== ADDRESS MANAGEMENT ====================

  async getAddresses(user: User): Promise<ShippingAddress[]> {
    return this.addressRepository.find({
      where: { user: { id: user.id } },
      order: { isDefault: 'DESC' },
    });
  }

  async createAddress(
    user: User,
    payload: Omit<Partial<ShippingAddress>, 'id' | 'user'>,
  ): Promise<ShippingAddress> {
    // If set as default, remove default flag from other addresses
    if (payload.isDefault) {
      await this.addressRepository.update(
        { user: { id: user.id }, isDefault: true },
        { isDefault: false },
      );
    }

    // Check if this is the first address, set as default
    const count = await this.addressRepository.count({
      where: { user: { id: user.id } },
    });

    const address = this.addressRepository.create({
      ...payload,
      isDefault: count === 0 ? true : payload.isDefault || false,
      user,
    });

    return this.addressRepository.save(address);
  }

  async updateAddress(
    addressId: string,
    user: User,
    payload: Partial<ShippingAddress>,
  ): Promise<ShippingAddress> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: user.id } },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    if (payload.isDefault && !address.isDefault) {
      await this.addressRepository.update(
        { user: { id: user.id }, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, payload);
    return this.addressRepository.save(address);
  }

  async deleteAddress(addressId: string, user: User): Promise<void> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: user.id } },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    await this.addressRepository.remove(address);

    // If we deleted the default address, set another one as default
    if (address.isDefault) {
      const remainingAddress = await this.addressRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await this.addressRepository.save(remainingAddress);
      }
    }
  }

  async setDefaultAddress(addressId: string, user: User): Promise<ShippingAddress> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: user.id } },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    await this.addressRepository.update(
      { user: { id: user.id }, isDefault: true },
      { isDefault: false },
    );

    address.isDefault = true;
    return this.addressRepository.save(address);
  }
}
