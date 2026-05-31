import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private shippingUrl = 'http://localhost:3000/api/shipping';
  private ordersUrl = 'http://localhost:3000/api/orders';
  private paymentsUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  // ==================== SHIPPING REGIONS & RATES ====================

  getProvinces(): Observable<any> {
    return this.http.get<any>(`${this.shippingUrl}/provinces`);
  }

  getCities(provinceId: string): Observable<any> {
    return this.http.get<any>(`${this.shippingUrl}/cities/${provinceId}`);
  }

  getDistricts(cityId: string): Observable<any> {
    return this.http.get<any>(`${this.shippingUrl}/districts/${cityId}`);
  }

  getVillages(districtId: string): Observable<any> {
    return this.http.get<any>(`${this.shippingUrl}/villages/${districtId}`);
  }

  calculateRates(cityId: string, weight: number): Observable<any> {
    return this.http.post<any>(`${this.shippingUrl}/calculate`, { cityId, weight });
  }

  getSavedAddresses(): Observable<any> {
    return this.http.get<any>(`${this.shippingUrl}/addresses`);
  }

  saveAddress(address: any): Observable<any> {
    return this.http.post<any>(`${this.shippingUrl}/addresses`, address);
  }

  // ==================== ORDERS & CHECKOUT ====================

  createOrder(payload: {
    addressId: string;
    courierName: string;
    courierService: string;
    shippingCost: number;
    couponCode?: string;
    notes?: string;
  }): Observable<any> {
    return this.http.post<any>(this.ordersUrl, payload);
  }

  getOrderTracking(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.ordersUrl}/${orderId}/tracking`);
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl);
  }

  // ==================== PAYMENTS ====================

  createPayment(orderId: string, method: string): Observable<any> {
    return this.http.post<any>(`${this.paymentsUrl}/create`, { orderId, method });
  }

  getPaymentStatus(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.paymentsUrl}/${orderId}/status`);
  }
}
