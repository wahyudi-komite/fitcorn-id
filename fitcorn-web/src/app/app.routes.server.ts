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
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
