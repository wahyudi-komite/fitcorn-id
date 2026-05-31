import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => this.initScripts(), { timeout: 3000 });
      } else {
        setTimeout(() => this.initScripts(), 2000);
      }
    }
  }

  private initScripts() {
    if ((window as any).analyticsInitialized) return;
    (window as any).analyticsInitialized = true;

    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtagFn = function() {
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag = (window as any).gtag || gtagFn;
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', 'G-PLACEHOLDER-GA4');

      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER-GA4`;
      document.head.appendChild(gtmScript);
    } catch (e) {
      console.warn('Analytics failed to initialize.', e);
    }
  }

  trackPageView(url: string) {
    if (!this.isBrowser) return;

    // GA4 PageView
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', { page_path: url });
    }

    // FB Pixel PageView
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'PageView');
    }

    // TikTok Pixel PageView
    if (typeof (window as any).ttq === 'function') {
      (window as any).ttq('page');
    }
  }

  trackAddToCart(product: any, quantity: number = 1) {
    if (!this.isBrowser) return;

    // GA4 AddToCart event
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'IDR',
        value: Number(product.price) * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: Number(product.price),
          quantity: quantity
        }]
      });
    }

    // FB Pixel AddToCart event
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_type: 'product',
        content_name: product.name,
        value: Number(product.price) * quantity,
        currency: 'IDR'
      });
    }

    // TikTok Pixel AddToCart event
    if (typeof (window as any).ttq === 'function') {
      (window as any).ttq('track', 'AddToCart', {
        contents: [{
          content_id: product.id,
          content_name: product.name,
          quantity: quantity,
          price: Number(product.price)
        }],
        value: Number(product.price) * quantity,
        currency: 'IDR'
      });
    }
  }

  trackPurchase(order: any) {
    if (!this.isBrowser) return;

    const items = (order.items || []).map((item: any) => ({
      item_id: item.product?.id || item.productId || 'popcorn-pack',
      item_name: item.productName || item.product?.name || 'Gourmet Popcorn Pack',
      price: Number(item.price),
      quantity: Number(item.quantity)
    }));

    const orderTotal = Number(order.total);

    // GA4 Purchase event
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'purchase', {
        transaction_id: order.orderNumber,
        value: orderTotal,
        currency: 'IDR',
        shipping: Number(order.shippingCost || 0),
        items: items
      });
    }

    // FB Pixel Purchase event
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Purchase', {
        content_ids: items.map((i: any) => i.item_id),
        content_type: 'product',
        value: orderTotal,
        currency: 'IDR'
      });
    }

    // TikTok Pixel Purchase event
    if (typeof (window as any).ttq === 'function') {
      (window as any).ttq('track', 'CompletePayment', {
        contents: items.map((i: any) => ({
          content_id: i.item_id,
          content_name: i.item_name,
          quantity: i.quantity,
          price: i.price
        })),
        value: orderTotal,
        currency: 'IDR'
      });
    }
  }
}
