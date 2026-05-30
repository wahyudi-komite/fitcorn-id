import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    this.initScripts();
  }

  private initScripts() {
    if (!this.isBrowser) return;

    // Check if scripts are already initialized
    if ((window as any).analyticsInitialized) return;
    (window as any).analyticsInitialized = true;

    try {
      // 1. Google Analytics 4 (gtag.js) setup
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtagFn = function() {
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag = (window as any).gtag || gtagFn;
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', 'G-PLACEHOLDER-GA4'); // Replace with live GA4 Measurement ID

      // 2. Google Tag Manager (gtm.js) script load
      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER-GA4`;
      document.head.appendChild(gtmScript);

      // 3. Facebook Pixel setup
      (window as any).fbq = function() {
        if ((window as any).fbq.callMethod) {
          (window as any).fbq.callMethod.apply((window as any).fbq, arguments);
        } else {
          (window as any).fbq.queue.push(arguments);
        }
      };
      (window as any).fbq.push = (window as any).fbq;
      (window as any).fbq.loaded = true;
      (window as any).fbq.version = '2.0';
      (window as any).fbq.queue = [];
      (window as any).fbq('init', 'PIXEL-PLACEHOLDER'); // Replace with live Pixel ID
      (window as any).fbq('track', 'PageView');

      const fbScript = document.createElement('script');
      fbScript.async = true;
      fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(fbScript);

      // 4. TikTok Pixel setup
      const ttqArray = (window as any).ttq = (window as any).ttq || [];
      ttqArray.methods = ['track', 'once', 'page', 'on', 'off', 'instance', 'info', 'set', 'compare', 'identify', 'user', 'dispatch', 'addTarget', 'clearUniqueId'];
      ttqArray.setAndDefer = function(t: any, e: any) {
        t[e] = function() {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttqArray.methods.length; i++) {
        ttqArray.setAndDefer(ttqArray, ttqArray.methods[i]);
      }
      ttqArray('load', 'TIKTOK-PLACEHOLDER'); // Replace with live TikTok Pixel Code
      ttqArray('page');

      const ttScript = document.createElement('script');
      ttScript.async = true;
      ttScript.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      document.head.appendChild(ttScript);

    } catch (e) {
      console.warn('Analytics tracking services failed to initialize.', e);
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
