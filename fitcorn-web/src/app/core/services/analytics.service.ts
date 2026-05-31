import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

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

    const gaId = environment.gaTrackingId || 'G-PLACEHOLDER-GA4';
    const fbId = environment.facebookPixelId || 'FB-PLACEHOLDER';
    const ttId = environment.tiktokPixelId || 'TT-PLACEHOLDER';

    try {
      // 1. Google Analytics 4
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtagFn = function() {
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag = (window as any).gtag || gtagFn;
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', gaId);

      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gtmScript);

      // 2. Facebook Pixel
      const f = window as any;
      if (!f.fbq) {
        const n = (f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        }) as any;
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        const t = document.createElement('script');
        t.async = !0;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0] || document.head;
        s.parentNode?.insertBefore(t, s);
      }
      f.fbq('init', fbId);
      f.fbq('track', 'PageView');

      // 3. TikTok Pixel
      if (!f.ttq) {
        const ttq = (f.ttq = []) as any;
        ttq.methods = [
          'page',
          'track',
          'identify',
          'instances',
          'debug',
          'on',
          'off',
          'once',
          'ready',
          'alias',
          'group',
          'enableCookie',
          'disableCookie',
        ];
        ttq.setAndDefer = function(t: any, e: any) {
          t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.instance = function(t: any) {
          const e = ttq._i[t] || [];
          for (let n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        ttq.load = function(e: any, n: any) {
          const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = i;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          const o = document.createElement('script');
          o.type = 'text/javascript';
          o.async = !0;
          o.src = i;
          const a = document.getElementsByTagName('script')[0] || document.head;
          a.parentNode?.insertBefore(o, a);
        };
      }
      f.ttq.load(ttId);
      f.ttq.page();
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
