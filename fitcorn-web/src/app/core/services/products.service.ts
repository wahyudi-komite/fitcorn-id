import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'popular' | 'latest';
    page?: number;
    limit?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getFeatured(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/featured`);
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  getRelatedProducts(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${slug}/related`);
  }
}
