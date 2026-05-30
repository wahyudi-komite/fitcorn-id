import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IShippingProvider, ShippingRateResult } from './shipping-provider.interface';

@Injectable()
export class RajaOngkirProvider implements IShippingProvider {
  private readonly logger = new Logger(RajaOngkirProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.rajaOngkir.apiKey') || '';
    this.baseUrl = this.configService.get<string>('app.rajaOngkir.baseUrl') || 'https://api.rajaongkir.com/starter';
  }

  async calculateRates(
    origin: string,
    destination: string,
    weight: number,
    courier: string,
  ): Promise<ShippingRateResult[]> {
    // If no API Key is supplied or it's a default placeholder, use simulated rates for Indonesian couriers
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      this.logger.log(`Using SIMULATED shipping rates for courier: ${courier}`);
      return this.getSimulatedRates(courier, weight);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/cost`,
        {
          origin,
          destination,
          weight,
          courier: courier.toLowerCase(),
        },
        {
          headers: {
            key: this.apiKey,
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const results = response.data?.rajaongkir?.results?.[0];
      if (!results || !results.costs) {
        return [];
      }

      return results.costs.map((c: any) => ({
        service: c.service,
        description: c.description,
        cost: c.cost?.[0]?.value || 0,
        etd: c.cost?.[0]?.etd || '2-3',
      }));
    } catch (error) {
      this.logger.error(`RajaOngkir API failed, fallback to simulated rates. Error: ${error.message}`);
      return this.getSimulatedRates(courier, weight);
    }
  }

  // Get simulated rates for JNE, J&T, SiCepat, AnterAja, Pos Indonesia
  private getSimulatedRates(courier: string, weight: number): ShippingRateResult[] {
    const weightMultiplier = Math.ceil(weight / 1000); // RajaOngkir cost is generally per kg
    const courierCode = courier.toLowerCase();

    switch (courierCode) {
      case 'jne':
        return [
          {
            service: 'REG',
            description: 'Layanan Reguler',
            cost: 15000 * weightMultiplier,
            etd: '2-3 HARI',
          },
          {
            service: 'YES',
            description: 'Yakin Esok Sampai',
            cost: 26000 * weightMultiplier,
            etd: '1 HARI',
          },
          {
            service: 'OKE',
            description: 'Ongkos Kirim Ekonomis',
            cost: 12000 * weightMultiplier,
            etd: '4-5 HARI',
          },
        ];
      case 'jnt':
      case 'j&t':
        return [
          {
            service: 'EZ',
            description: 'Regular Service',
            cost: 14000 * weightMultiplier,
            etd: '2-3 HARI',
          },
          {
            service: 'JSD',
            description: 'J&T Super',
            cost: 24000 * weightMultiplier,
            etd: '1 HARI',
          },
        ];
      case 'sicepat':
        return [
          {
            service: 'REG',
            description: 'Reguler SIUNTUNG',
            cost: 13000 * weightMultiplier,
            etd: '2-3 HARI',
          },
          {
            service: 'HALU',
            description: 'Harga Lima Ribu (Ekonomis)',
            cost: 9500 * weightMultiplier,
            etd: '3-4 HARI',
          },
          {
            service: 'BEST',
            description: 'Besok Sampai Tujuan',
            cost: 22000 * weightMultiplier,
            etd: '1 HARI',
          },
        ];
      case 'anteraja':
        return [
          {
            service: 'REG',
            description: 'Regular Service',
            cost: 13500 * weightMultiplier,
            etd: '2-3 HARI',
          },
          {
            service: 'ND',
            description: 'Next Day',
            cost: 20000 * weightMultiplier,
            etd: '1 HARI',
          },
        ];
      case 'pos':
        return [
          {
            service: 'KILAT',
            description: 'Pos Kilat Khusus',
            cost: 11000 * weightMultiplier,
            etd: '3-4 HARI',
          },
          {
            service: 'EXPRESS',
            description: 'Pos Express',
            cost: 23000 * weightMultiplier,
            etd: '1-2 HARI',
          },
        ];
      default:
        return [
          {
            service: 'REG',
            description: 'Standard Delivery',
            cost: 15000 * weightMultiplier,
            etd: '3-5 HARI',
          },
        ];
    }
  }

  // Fetch province list from RajaOngkir
  async getProvinces(): Promise<any[]> {
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      return this.getSimulatedProvinces();
    }
    try {
      const response = await axios.get(`${this.baseUrl}/province`, {
        headers: { key: this.apiKey },
      });
      return response.data?.rajaongkir?.results || [];
    } catch (error) {
      this.logger.error(`RajaOngkir Fetch Province failed: ${error.message}`);
      return this.getSimulatedProvinces();
    }
  }

  // Fetch city list by province id from RajaOngkir
  async getCities(provinceId: string): Promise<any[]> {
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      return this.getSimulatedCities(provinceId);
    }
    try {
      const response = await axios.get(`${this.baseUrl}/city?province=${provinceId}`, {
        headers: { key: this.apiKey },
      });
      return response.data?.rajaongkir?.results || [];
    } catch (error) {
      this.logger.error(`RajaOngkir Fetch Cities failed: ${error.message}`);
      return this.getSimulatedCities(provinceId);
    }
  }

  private getSimulatedProvinces(): any[] {
    return [
      { province_id: '1', province: 'Bali' },
      { province_id: '2', province: 'Bangka Belitung' },
      { province_id: '3', province: 'Banten' },
      { province_id: '5', province: 'DI Yogyakarta' },
      { province_id: '6', province: 'DKI Jakarta' },
      { province_id: '9', province: 'Jawa Barat' },
      { province_id: '10', province: 'Jawa Tengah' },
      { province_id: '11', province: 'Jawa Timur' },
    ];
  }

  private getSimulatedCities(provinceId: string): any[] {
    const citiesMap: Record<string, any[]> = {
      '5': [
        { city_id: '39', city_name: 'Bantul', type: 'Kabupaten', postal_code: '55715' },
        { city_id: '135', city_name: 'Gunung Kidul', type: 'Kabupaten', postal_code: '55812' },
        { city_id: '419', city_name: 'Sleman', type: 'Kabupaten', postal_code: '55511' },
        { city_id: '501', city_name: 'Yogyakarta', type: 'Kota', postal_code: '55111' },
      ],
      '6': [
        { city_id: '151', city_name: 'Jakarta Barat', type: 'Kota', postal_code: '11210' },
        { city_id: '152', city_name: 'Jakarta Pusat', type: 'Kota', postal_code: '10110' },
        { city_id: '153', city_name: 'Jakarta Selatan', type: 'Kota', postal_code: '12110' },
        { city_id: '154', city_name: 'Jakarta Timur', type: 'Kota', postal_code: '13110' },
        { city_id: '155', city_name: 'Jakarta Utara', type: 'Kota', postal_code: '14110' },
      ],
      '9': [
        { city_id: '22', city_name: 'Bandung', type: 'Kota', postal_code: '40111' },
        { city_id: '23', city_name: 'Bandung', type: 'Kabupaten', postal_code: '40311' },
        { city_id: '54', city_name: 'Bekasi', type: 'Kota', postal_code: '17111' },
        { city_id: '78', city_name: 'Bogor', type: 'Kota', postal_code: '16111' },
        { city_id: '115', city_name: 'Depok', type: 'Kota', postal_code: '16411' },
      ],
      '11': [
        { city_id: '256', city_name: 'Malang', type: 'Kota', postal_code: '65111' },
        { city_id: '444', city_name: 'Surabaya', type: 'Kota', postal_code: '60111' },
      ],
    };

    return citiesMap[provinceId] || [
      { city_id: '99', city_name: 'Kota Simulasi A', type: 'Kota', postal_code: '12345' },
      { city_id: '100', city_name: 'Kota Simulasi B', type: 'Kota', postal_code: '54321' },
    ];
  }
}
