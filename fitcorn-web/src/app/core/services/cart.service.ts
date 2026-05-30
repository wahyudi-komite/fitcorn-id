import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  cart = signal<any | null>(null);

  // Computed signals for reactive UI rendering (popcorn cart counter, etc.)
  itemsCount = computed(() => {
    const c = this.cart();
    if (!c || !c.items) return 0;
    return c.items.reduce((total: number, item: any) => total + item.quantity, 0);
  });

  subtotal = computed(() => {
    const c = this.cart();
    if (!c || !c.items) return 0;
    return c.items.reduce((total: number, item: any) => {
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
      return total + price * item.quantity;
    }, 0);
  });

  totalWeight = computed(() => {
    const c = this.cart();
    if (!c || !c.items) return 0;
    return c.items.reduce((total: number, item: any) => {
      const weight = item.variant ? Number(item.variant.weight) : Number(item.product.weight);
      return total + weight * item.quantity;
    }, 0);
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.loadCart();
  }

  private getRequestHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (!this.authService.isAuthenticated()) {
      const guestSessionId = this.authService.getGuestSessionId();
      if (guestSessionId) {
        headers = headers.set('x-session-id', guestSessionId);
      }
    }
    return headers;
  }

  loadCart() {
    const headers = this.getRequestHeaders();
    const isGuest = !this.authService.isAuthenticated();
    const endpoint = isGuest ? `${this.apiUrl}/guest` : this.apiUrl;

    this.http.get<any>(endpoint, { headers }).subscribe({
      next: (cart) => this.cart.set(cart),
      error: () => this.cart.set(null),
    });
  }

  addItem(productId: string, quantity: number, variantId?: string): Observable<any> {
    const headers = this.getRequestHeaders();
    const isGuest = !this.authService.isAuthenticated();
    const endpoint = isGuest ? `${this.apiUrl}/guest/items` : `${this.apiUrl}/items`;

    return this.http.post<any>(endpoint, { productId, quantity, variantId }, { headers }).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    const headers = this.getRequestHeaders();
    const isGuest = !this.authService.isAuthenticated();
    const endpoint = isGuest
      ? `${this.apiUrl}/guest/items/${itemId}`
      : `${this.apiUrl}/items/${itemId}`;

    return this.http.put<any>(endpoint, { quantity }, { headers }).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  removeItem(itemId: number): Observable<any> {
    const headers = this.getRequestHeaders();
    const isGuest = !this.authService.isAuthenticated();
    const endpoint = isGuest
      ? `${this.apiUrl}/guest/items/${itemId}`
      : `${this.apiUrl}/items/${itemId}`;

    return this.http.delete<any>(endpoint, { headers }).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  clearCart(): Observable<any> {
    const headers = this.getRequestHeaders();
    const isGuest = !this.authService.isAuthenticated();
    const endpoint = isGuest ? `${this.apiUrl}/guest` : this.apiUrl;

    return this.http.delete<any>(endpoint, { headers }).pipe(
      tap(() => this.cart.set(null)),
    );
  }

  mergeCartOnLogin(): Observable<any> {
    const guestSessionId = this.authService.getGuestSessionId();
    const headers = new HttpHeaders().set('x-session-id', guestSessionId);

    return this.http.post<any>(`${this.apiUrl}/merge`, {}, { headers }).pipe(
      tap((cart) => {
        this.cart.set(cart);
        // Clear local guest session key once merged
        if (typeof window !== 'undefined') {
          localStorage.removeItem('fitcorn_session_id');
        }
      }),
    );
  }
}
