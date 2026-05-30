import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  setTitle(title: string): void {
    this.title.setTitle(`${title} - Fitcorn Premium Popcorn`);
  }

  setDefaultMeta(): void {
    this.title.setTitle('Fitcorn - Premium Popcorn Indonesia');
    this.meta.updateTag({ name: 'description', content: 'Premium popcorn berkualitas tinggi dengan berbagai varian rasa. Belanja online popcorn terenak di Indonesia.' });
    this.meta.updateTag({ property: 'og:title', content: 'Fitcorn - Premium Popcorn Indonesia' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  setProductMeta(product: Product): void {
    const title = `${product.name} - Fitcorn Premium Popcorn`;
    const desc = product.metaDescription || `${product.name} - Premium popcorn by Fitcorn. ${product.description?.substring(0, 150)}`;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: product.name });
    this.meta.updateTag({ property: 'og:description', content: desc });
    if (product.images?.length) {
      this.meta.updateTag({ property: 'og:image', content: product.images[0].url });
    }
    this.injectStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.map(i => i.url),
      offers: {
        '@type': 'Offer',
        price: product.salePrice ?? product.price,
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
      },
    });
  }

  setOrderMeta(orderNumber: string): void {
    this.title.setTitle(`Pesanan ${orderNumber} - Fitcorn`);
    this.meta.updateTag({ name: 'description', content: `Status pesanan ${orderNumber} di Fitcorn Premium Popcorn.` });
  }

  private injectStructuredData(json: Record<string, unknown>): void {
    if (isPlatformBrowser(this.platformId)) {
      const existing = document.getElementById('structured-data');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(json);
      document.head.appendChild(script);
    }
  }
}
