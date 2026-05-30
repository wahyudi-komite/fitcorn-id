import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'produk/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'pesanan/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'akun',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/produk',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/produk/baru',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/produk/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'auth/callback',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
