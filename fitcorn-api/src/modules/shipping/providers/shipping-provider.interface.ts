export interface ShippingRateResult {
  service: string;
  description: string;
  cost: number;
  etd: string; // Estimated time of delivery
}

export interface IShippingProvider {
  calculateRates(
    origin: string,
    destination: string, // city_id
    weight: number, // in grams
    courier: string, // 'jne' | 'pos' | 'tiki' etc.
  ): Promise<ShippingRateResult[]>;
}
