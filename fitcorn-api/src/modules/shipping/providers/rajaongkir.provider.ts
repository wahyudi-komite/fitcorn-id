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
    let url = this.configService.get<string>('app.rajaOngkir.baseUrl') || 'https://api.rajaongkir.com/starter';
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    this.baseUrl = url;
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
      const isKomerce = this.baseUrl.includes('komerce.id');
      const costUrl = isKomerce ? `${this.baseUrl}/calculate/domestic-cost` : `${this.baseUrl}/cost`;

      const response = await axios.post(
        costUrl,
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

      const status = response.data?.rajaongkir?.status;
      if (status && status.code !== 200) {
        throw new Error(status.description || 'RajaOngkir API Error');
      }

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

  async getProvinces(): Promise<any[]> {
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      return this.getSimulatedProvinces().sort((a, b) => a.province.localeCompare(b.province));
    }
    try {
      const isKomerce = this.baseUrl.includes('komerce.id');
      const provincesUrl = isKomerce ? `${this.baseUrl}/destination/province` : `${this.baseUrl}/province`;

      const response = await axios.get(provincesUrl, {
        headers: { key: this.apiKey },
      });

      if (isKomerce) {
        const meta = response.data?.meta;
        if (meta && meta.code !== 200) {
          throw new Error(meta.message || 'Komerce API Error');
        }
        const results = response.data?.data || [];
        const list = results.map((p: any) => ({
          province_id: String(p.id),
          province: p.name,
        }));
        return list.sort((a, b) => a.province.localeCompare(b.province));
      }

      const status = response.data?.rajaongkir?.status;
      if (status && status.code !== 200) {
        throw new Error(status.description || 'RajaOngkir API Error');
      }
      const list = response.data?.rajaongkir?.results || [];
      return list.sort((a, b) => a.province.localeCompare(b.province));
    } catch (error) {
      this.logger.error(`RajaOngkir Fetch Province failed: ${error.message}`);
      return this.getSimulatedProvinces().sort((a, b) => a.province.localeCompare(b.province));
    }
  }

  async getCities(provinceId: string): Promise<any[]> {
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      return this.getSimulatedCities(provinceId).sort((a, b) => a.city_name.localeCompare(b.city_name));
    }
    try {
      const isKomerce = this.baseUrl.includes('komerce.id');
      const citiesUrl = isKomerce 
        ? `${this.baseUrl}/destination/city/${provinceId}` 
        : `${this.baseUrl}/city?province=${provinceId}`;

      const response = await axios.get(citiesUrl, {
        headers: { key: this.apiKey },
      });

      if (isKomerce) {
        const meta = response.data?.meta;
        if (meta && meta.code !== 200) {
          throw new Error(meta.message || 'Komerce API Error');
        }
        const results = response.data?.data || [];
        const list = results.map((c: any) => {
          const isKab = c.name.toLowerCase().includes('kabupaten') || c.name.toLowerCase().includes('kab.');
          const cleanName = c.name.replace(/kabupaten|kota|kab\./gi, '').trim();
          return {
            city_id: String(c.id),
            city_name: cleanName,
            type: isKab ? 'Kabupaten' : 'Kota',
            postal_code: c.postal_code || '00000',
          };
        });
        return list.sort((a, b) => a.city_name.localeCompare(b.city_name));
      }

      const status = response.data?.rajaongkir?.status;
      if (status && status.code !== 200) {
        throw new Error(status.description || 'RajaOngkir API Error');
      }
      const list = response.data?.rajaongkir?.results || [];
      return list.sort((a, b) => a.city_name.localeCompare(b.city_name));
    } catch (error) {
      this.logger.error(`RajaOngkir Fetch Cities failed: ${error.message}`);
      return this.getSimulatedCities(provinceId).sort((a, b) => a.city_name.localeCompare(b.city_name));
    }
  }

  async getDistricts(cityId: string): Promise<any[]> {
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      return this.getSimulatedDistricts(cityId).sort((a, b) => a.subdistrict_name.localeCompare(b.subdistrict_name));
    }
    try {
      const isKomerce = this.baseUrl.includes('komerce.id');
      if (isKomerce) {
        const districtsUrl = `${this.baseUrl}/destination/district/${cityId}`;
        const response = await axios.get(districtsUrl, {
          headers: { key: this.apiKey },
        });
        const meta = response.data?.meta;
        if (meta && meta.code !== 200) {
          throw new Error(meta.message || 'Komerce API Error');
        }
        const results = response.data?.data || [];
        const list = results.map((d: any) => ({
          subdistrict_id: String(d.id),
          subdistrict_name: d.name,
        }));
        return list.sort((a, b) => a.subdistrict_name.localeCompare(b.subdistrict_name));
      } else {
        const response = await axios.get(`${this.baseUrl}/subdistrict?city=${cityId}`, {
          headers: { key: this.apiKey },
        });
        const status = response.data?.rajaongkir?.status;
        if (status && status.code !== 200) {
          throw new Error(status.description || 'RajaOngkir API Error');
        }
        const list = response.data?.rajaongkir?.results || [];
        return list.sort((a, b) => a.subdistrict_name.localeCompare(b.subdistrict_name));
      }
    } catch (error) {
      this.logger.error(`RajaOngkir Fetch Districts failed: ${error.message}`);
      return this.getSimulatedDistricts(cityId).sort((a, b) => a.subdistrict_name.localeCompare(b.subdistrict_name));
    }
  }

  private getSimulatedDistricts(cityId: string): any[] {
    const districtsMap: Record<string, any[]> = {
      '183': [
        { subdistrict_id: '1', subdistrict_name: 'Karawang Barat' },
        { subdistrict_id: '2', subdistrict_name: 'Karawang Timur' },
        { subdistrict_id: '3', subdistrict_name: 'Telukjambe Timur' },
        { subdistrict_id: '4', subdistrict_name: 'Telukjambe Barat' },
      ]
    };
    return districtsMap[cityId] || [
      { subdistrict_id: '991', subdistrict_name: 'Kecamatan Simulasi X' },
      { subdistrict_id: '992', subdistrict_name: 'Kecamatan Simulasi Y' },
    ];
  }

  async getVillages(districtId: string): Promise<any[]> {
    if (!this.apiKey || this.apiKey === 'your_rajaongkir_api_key' || this.apiKey.includes('XXXX')) {
      return this.getSimulatedVillages(districtId).sort((a, b) => a.village_name.localeCompare(b.village_name));
    }
    try {
      const isKomerce = this.baseUrl.includes('komerce.id');
      if (isKomerce) {
        const subdistrictsUrl = `${this.baseUrl}/destination/sub-district/${districtId}`;
        const response = await axios.get(subdistrictsUrl, {
          headers: { key: this.apiKey },
        });
        const meta = response.data?.meta;
        if (meta && meta.code !== 200) {
          throw new Error(meta.message || 'Komerce API Error');
        }
        const results = response.data?.data || [];
        const list = results.map((v: any) => ({
          village_id: String(v.id),
          village_name: v.name,
          postal_code: v.zip_code || '00000',
        }));
        return list.sort((a, b) => a.village_name.localeCompare(b.village_name));
      } else {
        // Standard RajaOngkir doesn't support kelurahan directly, so we fallback
        return this.getSimulatedVillages(districtId).sort((a, b) => a.village_name.localeCompare(b.village_name));
      }
    } catch (error) {
      this.logger.error(`RajaOngkir Fetch Villages failed: ${error.message}`);
      return this.getSimulatedVillages(districtId).sort((a, b) => a.village_name.localeCompare(b.village_name));
    }
  }

  private getSimulatedVillages(districtId: string): any[] {
    const villagesMap: Record<string, any[]> = {
      '1': [ // Karawang Barat
        { village_id: '101', village_name: 'Tanjungmekar', postal_code: '41316' },
        { village_id: '102', village_name: 'Tanjungpura', postal_code: '41315' },
        { village_id: '103', village_name: 'Tunggulgandrung', postal_code: '41311' },
        { village_id: '104', village_name: 'Sirnabaya', postal_code: '41311' },
      ],
      '3': [ // Telukjambe Timur
        { village_id: '301', village_name: 'Sukaluyu', postal_code: '41361' },
        { village_id: '302', village_name: 'Sirnabakti', postal_code: '41361' },
        { village_id: '303', village_name: 'Wadas', postal_code: '41361' },
      ]
    };
    return villagesMap[districtId] || [
      { village_id: '9991', village_name: 'Kelurahan Simulasi A', postal_code: '12345' },
      { village_id: '9992', village_name: 'Kelurahan Simulasi B', postal_code: '54321' },
    ];
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
        { city_id: '183', city_name: 'Karawang', type: 'Kota', postal_code: '41311' },
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
