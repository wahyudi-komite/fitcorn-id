import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'produk',
    loadComponent: () => import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'produk/:slug',
    loadComponent: () => import('./features/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'keranjang',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'pesanan/:id',
    loadComponent: () => import('./features/order-tracking/order-tracking.component').then((m) => m.OrderTrackingComponent),
  },
  {
    path: 'masuk',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'daftar',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'akun',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
