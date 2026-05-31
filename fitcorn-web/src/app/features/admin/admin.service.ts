import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // 1. Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard/stats`, { withCredentials: true });
  }

  // 2. Categories CRUD
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/categories`, { withCredentials: true });
  }
  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/categories`, data, { withCredentials: true });
  }
  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/categories/${id}`, data, { withCredentials: true });
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/categories/${id}`, { withCredentials: true });
  }

  // 3. Orders Management
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/orders`, { withCredentials: true });
  }
  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/orders/${id}/status`, { status }, { withCredentials: true });
  }
  inputTrackingNumber(id: string, data: { courierName: string; courierService: string; trackingNumber: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/orders/${id}/tracking`, data, { withCredentials: true });
  }

  // 4. Customers Management
  getCustomers(params?: { search?: string; page?: number; limit?: number }): Observable<any> {
    let httpParams: any = {};
    if (params) {
      if (params.search) httpParams.search = params.search;
      if (params.page !== undefined) httpParams.page = params.page.toString();
      if (params.limit !== undefined) httpParams.limit = params.limit.toString();
    }
    return this.http.get<any>(`${this.apiUrl}/admin/customers`, { params: httpParams, withCredentials: true });
  }
  updateCustomerStatus(id: string, isActive: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/customers/${id}/status`, { isActive }, { withCredentials: true });
  }

  // 5. Settings Management
  getSettings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/settings`, { withCredentials: true });
  }
  updateSettings(settings: { [key: string]: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/settings`, settings, { withCredentials: true });
  }

  // 6. Product Image Upload
  uploadProductImage(productId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(`${this.apiUrl}/admin/products/${productId}/images`, formData, { withCredentials: true });
  }

  // 7. Banners CRUD
  getBanners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/banners`, { withCredentials: true });
  }
  createBanner(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/banners`, data, { withCredentials: true });
  }
  updateBanner(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/banners/${id}`, data, { withCredentials: true });
  }
  deleteBanner(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/banners/${id}`, { withCredentials: true });
  }

  // 8. Instagram Gallery CRUD
  getInstagramPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/instagram`, { withCredentials: true });
  }
  createInstagramPost(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/instagram`, data, { withCredentials: true });
  }
  updateInstagramPost(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/instagram/${id}`, data, { withCredentials: true });
  }
  deleteInstagramPost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/instagram/${id}`, { withCredentials: true });
  }

  // 9. Coupons CRUD
  getCoupons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/coupons`, { withCredentials: true });
  }
  createCoupon(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/coupons`, data, { withCredentials: true });
  }
  updateCoupon(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/coupons/${id}`, data, { withCredentials: true });
  }
  deleteCoupon(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/coupons/${id}`, { withCredentials: true });
  }

  // 10. WhatsApp Management
  /** Get connection status of Baileys socket */
  getWhatsAppStatus(): Observable<{ connected: boolean }> {
    return this.http.get<{ connected: boolean }>(`${this.apiUrl}/admin/whatsapp/status`, { withCredentials: true });
  }
  /** Trigger a manual disconnect of the WhatsApp socket */
  disconnectWhatsApp(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/whatsapp/disconnect`, {}, { withCredentials: true });
  }
}
