# 📖 DOKUMENTASI TEKNIS LENGKAP — FITCORN E-COMMERCE
**Versi Dokumen:** 1.0.0  
**Tanggal:** 30 Mei 2026  
**Dibuat oleh:** Analisis Otomatis via Antigravity AI  
**Status Proyek:** 🟡 In Development (Backend Complete, Frontend Complete, Integrasi Aktif)

---

## 📌 1. OVERVIEW PROJECT

### Tujuan Aplikasi
Fitcorn adalah platform e-commerce **B2C (Business-to-Consumer)** yang dibangun khusus untuk brand popcorn premium asal Indonesia. Sistem ini dirancang untuk mengelola seluruh siklus hidup penjualan online — dari browsing katalog produk, manajemen keranjang belanja, proses checkout dengan kalkulasi ongkir real-time, integrasi pembayaran via payment gateway, hingga pelacakan order.

### Masalah yang Diselesaikan
| Masalah | Solusi yang Diimplementasikan |
|---|---|
| Race condition stok saat order bersamaan | Pessimistic locking (`pessimistic_write`) di dalam ACID transaction |
| Pengalaman checkout yang lambat | Kalkulasi ongkir real-time via RajaOngkir API |
| Pembayaran manual yang rawan human error | Integrasi otomatis Midtrans + webhook handler |
| Duplikasi keranjang belanja guest vs login | Mekanisme cart merge saat user berhasil login |
| Data produk tidak ter-index mesin pencari | SSR via Angular 20 + Schema.org structured data |

### Target User
- **Pelanggan Ritel (B2C):** Konsumen yang mencari camilan sehat premium di Indonesia.
- **Administrator:** Tim internal Fitcorn yang mengelola produk, order, dan konten.

### Use Case Utama
```
Guest: Browse Catalog → View Product Detail → Add to Cart → Register/Login → Checkout → Payment → Tracking
Admin: Login → Manage Products/Inventory → Process Orders → Update Tracking Number
```

---

## 🏗️ 2. ARSITEKTUR SISTEM

### Tipe Arsitektur
**Modular Monolith** — Satu codebase backend NestJS yang dipisahkan bersih per domain bisnis menggunakan NestJS Module system. Tidak menggunakan microservices, tetapi pola modulnya memudahkan migrasi ke microservices di masa depan.

### Stack Overview
```
┌────────────────────────────────────────────────────┐
│              CLIENT (Browser / Crawler)            │
└───────────────────────┬────────────────────────────┘
                        │ HTTP / SSR
┌───────────────────────▼────────────────────────────┐
│         FITCORN-WEB (Angular 20 SSR)               │
│  - Angular Universal (Node.js Express Server)      │
│  - Tailwind CSS v4, Signals, RxJS                  │
│  - Route: localhost:4200                           │
└───────────────────────┬────────────────────────────┘
                        │ REST API (HTTP/JSON)
┌───────────────────────▼────────────────────────────┐
│          FITCORN-API (NestJS Backend)              │
│  - 13 Feature Modules (Auth, Products, Orders...)  │
│  - JWT Auth Guard (Global)                         │
│  - Rate Limiter (100 req/60s)                      │
│  - Route: localhost:3000/api                       │
└──────────┬────────────┬────────────────────────────┘
           │            │
  ┌────────▼──┐  ┌──────▼──────────────────────────┐
  │  MySQL DB │  │  External APIs                  │
  │ (TypeORM) │  │  - Midtrans (Payment Gateway)   │
  └───────────┘  │  - RajaOngkir (Shipping Cost)   │
                 └─────────────────────────────────┘
```

### Flow Data: Frontend → Backend → Database
```
1. USER ACTION (Browser)
   └─ Angular Component (Signal-based reactive UI)
      └─ Core Service (HTTP Client + Auth Interceptor)
         └─ Authorization Header: "Bearer {JWT}"

2. API REQUEST RECEIVED (NestJS)
   └─ app.module.ts → Global JWT Guard
      └─ Controller (validate roles, parse DTO)
         └─ Service Layer (business logic, ACID transaction)
            └─ TypeORM Repository → MySQL

3. EXTERNAL INTEGRATION
   └─ ShippingService → RajaOngkirProvider → rajaongkir.com/api
   └─ PaymentsService → MidtransProvider → api.midtrans.com

4. RESPONSE
   └─ JSON Response → Error Interceptor (Angular)
      └─ 401? → Auto-refresh token → Retry request
         └─ Update Signal → Angular re-renders UI
```

---

## 🧩 3. FITUR APLIKASI (DETAIL)

### 3.1 Autentikasi & Otorisasi ✅ SELESAI

- **Register:** Validasi email unik, password di-hash dengan `bcryptjs` (salt 10), user otomatis mendapat role `customer`.
- **Login:** Verifikasi password, generate `accessToken` (JWT, short-lived) + `refreshToken` (JWT, long-lived). Refresh token di-store di database field `users.refresh_token`.
- **Refresh Session:** Endpoint `/api/auth/refresh` menggunakan `refreshToken` dari HttpOnly Cookie untuk menerbitkan access token baru.
- **Logout:** Menghapus `refresh_token` dari DB, membersihkan localStorage di frontend.
- **Auto-seeding Admin:** Saat aplikasi pertama kali start, `AuthService.onModuleInit()` otomatis membuat akun `admin@fitcorn.com` dan role `admin`/`customer` jika belum ada.
- **Role-based Access:** Guard `JwtAuthGuard` terpasang secara **global** di `app.module.ts`. Route publik menggunakan decorator `@Public()`.

**Frontend Flow:**
- `AuthService` (Angular) menyimpan `accessToken` ke `localStorage`.
- `authInterceptor` menyuntikkan `Authorization: Bearer {token}` ke setiap HTTP request.
- `errorInterceptor` menangkap `401` dan otomatis memanggil `refreshSession()`, lalu retry request asal.

---

### 3.2 Manajemen Produk & Katalog ✅ SELESAI

- **CRUD Produk (Admin):** Create, Read, Update, Delete produk beserta gambar, varian, dan inventori.
- **Pencarian & Filter:** Filter berdasarkan kategori, rentang harga (`minPrice`/`maxPrice`), dan kata kunci (`search LIKE`).
- **Sorting:** Sort by `price_asc`, `price_desc`, `popular` (berdasarkan `soldCount`), `latest`.
- **Paginasi:** Response mengikutkan `meta: { total, page, limit, totalPages }`.
- **Featured Products:** Endpoint `/api/products/featured` — menampilkan maks. 8 produk dengan flag `isFeatured: true`.
- **Related Products:** Endpoint `/api/products/:slug/related` — mencari produk lain di kategori yang sama.
- **Detail by Slug:** Endpoint `/api/products/:slug` — SEO-friendly URL untuk SSR.
- **Auto-seeding:** `ProductsService.onModuleInit()` menyemai 5 produk beserta varian, gambar, dan inventori awal jika database masih kosong.
- **SEO Fields:** Setiap produk memiliki `metaTitle` dan `metaDescription` untuk optimasi mesin pencari.

**Produk Seed (5 produk):**
1. Sweet Honey Butter (2 varian: 150g, 450g)
2. Classic Himalayan Salt (2 varian: 150g, 450g)
3. Spicy Cheese Lava (2 varian: 150g, 450g)
4. Matcha White Chocolate (2 varian: 150g, 450g)
5. Truffle Black Pepper (2 varian: 150g, 450g)

---

### 3.3 Keranjang Belanja (Guest & Member) ✅ SELESAI

- **Guest Cart:** Guest dapat berbelanja tanpa login menggunakan `sessionId` yang di-generate di `localStorage`. Cart disimpan di DB dengan kolom `session_id`.
- **Member Cart:** Cart terikat ke `userId` (One-to-One relation dengan `User`).
- **Cart Merge:** Saat guest login, endpoint `/api/cart/merge` menggabungkan item cart guest ke cart member secara atomic.
- **Add/Update/Remove Item:** Support penambahan produk dengan atau tanpa varian.
- **Computed Signals (Frontend):** `CartService` menggunakan Angular Signals untuk reaktivitas — `itemsCount`, `subtotal`, dan `totalWeight` dihitung secara otomatis setiap kali state cart berubah.

---

### 3.4 Manajemen Wishlist ✅ SELESAI

- Fitur simpan/hapus produk favorit, hanya untuk user yang terautentikasi.
- Endpoint: `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:productId`.

---

### 3.5 Checkout & Pembuatan Order ✅ SELESAI (KRITIS)

Ini adalah inti dari sistem. Proses `createOrder` berjalan dalam **ACID Transaction** penuh:

```
1. Validasi cart tidak kosong
2. Validasi alamat pengiriman (milik user tersebut)
3. START TRANSACTION (queryRunner)
4. Loop per item:
   a. Reload Product dengan lock: { mode: 'pessimistic_write' } ← KRITIS
   b. Reload ProductVariant dengan lock (jika ada varian)
   c. Cek stok: (quantity - reserved) >= item.quantity
   d. Jika cukup: inventory.reserved += item.quantity (reserve stok)
   e. Buat snapshot OrderItem (nama produk, harga, gambar di-snapshot)
5. Hitung subtotal, shippingCost, discount, total
6. Generate orderNumber: FTC-YYYYMMDD-XXXX
7. CREATE Order → SAVE
8. DELETE semua CartItem user
9. COMMIT TRANSACTION
10. Return saved order
```

**State Machine Order:**
```
PENDING → WAITING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED
         ↘                ↘
          CANCELLED        CANCELLED (jika payment expired)
```

**Inventory Lifecycle:**
- Saat order dibuat: `reserved += qty` (stok dikunci)
- Saat payment sukses (webhook): `reserved -= qty`, `quantity -= qty` (stok benar-benar berkurang)
- Saat order dibatalkan: `reserved -= qty` (stok dilepas kembali)

---

### 3.6 Pengiriman (RajaOngkir) ✅ SELESAI

- **Origin Kota:** Yogyakarta (City ID: `501`) — hardcoded sebagai lokasi gudang Fitcorn.
- **Provinces & Cities:** Proxy ke RajaOngkir API untuk mendapatkan daftar provinsi dan kota.
- **Rate Calculation:** Menghitung ongkir ke semua kurir aktif di DB secara paralel (`Promise.all`). Kurir yang gagal merespons tidak menghentikan kurir lain (error ditangkap per-kurir).
- **Address Management:** CRUD alamat pengiriman user. Otomatis set default jika alamat pertama. Jika alamat default dihapus, sistem otomatis set alamat lain sebagai default.

---

### 3.7 Pembayaran (Midtrans) ✅ SELESAI

**Provider Pattern:** Terdapat `payment-provider.interface.ts` yang mendefinisikan kontrak, memungkinkan penambahan provider baru (mis. Xendit) tanpa mengubah `PaymentsService`.

**Flow Pembayaran:**
```
1. POST /api/payments/create { orderId, method }
2. PaymentsService memanggil MidtransProvider.createPayment(order, method)
3. Midtrans mengembalikan { externalId, paymentUrl, vaNumber, status }
4. Payment record dibuat/diupdate di DB
5. Order status → WAITING_PAYMENT
6. Frontend menerima paymentUrl → redirect ke halaman pembayaran Midtrans
```

**Webhook Handler (`POST /api/payments/webhook`):**
```
1. Terima payload dari Midtrans
2. Verifikasi signature (MidtransProvider.verifyWebhook)
3. START TRANSACTION (queryRunner) dengan pessimistic_write lock pada Payment
4. Parse status: settlement → SUCCESS, expire/deny → FAILED/EXPIRED
5. Jika SUCCESS: order.status = PAID, kurangi inventory
6. Jika FAILED/EXPIRED: order.status = CANCELLED, release inventory reserved
7. COMMIT TRANSACTION
```

**Polling Status:** `GET /api/payments/:orderId/status` juga memanggil Midtrans API untuk cek status terkini jika status lokal masih PENDING.

---

### 3.8 Kupon & Diskon ⚠️ SEBAGIAN

- Entity `Coupon` sudah lengkap dengan field: `code`, `type` (percentage/fixed), `value`, `minPurchase`, `maxDiscount`, `usageLimit`, `usedCount`, `startDate`, `endDate`, `isActive`.
- CRUD endpoint dan validasi kupon sudah ada di `coupons.service.ts`.
- **⚠️ CATATAN:** Integrasi kupon di `OrdersService.createOrder` **belum aktif** (ada komentar `// TBD Coupon Code loading and validation`). Untuk mengaktifkan, inject `CouponsService` ke `OrdersService` dan panggil validasi sebelum kalkulasi `total`.

---

### 3.9 Banner & Konten CMS ✅ SELESAI (Entity)

- Entity `Banner` mendukung: `title`, `subtitle`, `imageUrl`, `mobileImageUrl` (responsive), `linkUrl`, `isActive`, `sortOrder`, `startDate`, `endDate`.
- Entity `InstagramGallery` untuk galeri foto Instagram di halaman utama.

---

### 3.10 Notifikasi User ✅ SELESAI (Entity)

- Tipe notifikasi: `order_status`, `promo`, `general`.
- Field: `title`, `message`, `isRead`, `data` (JSON metadata).
- **⚠️ CATATAN:** Module controller/service untuk notifikasi belum dibuat. Entity sudah siap.

---

### 3.11 Pengaturan Aplikasi ✅ SELESAI (Entity)

- Key-value store yang fleksibel untuk konfigurasi dinamis.
- Mendukung pengelompokan: `general`, `payment`, `shipping`, `seo`.
- Tipe nilai: `string`, `number`, `boolean`, `json`.

---

### 3.12 Audit Log (Admin) ✅ SELESAI (Entity)

- Mencatat setiap aksi admin: `action`, `entityType`, `entityId`, `oldValues`, `newValues`, `ipAddress`, `userAgent`.
- **⚠️ CATATAN:** Belum diintegrasikan ke dalam AdminController (service/controller belum dibuat).

---

### 3.13 Frontend Features ✅ SELESAI

**Pages:**
| Route | Komponen | Render Mode | Keterangan |
|---|---|---|---|
| `/` | HomeComponent | Prerender | Halaman utama, banner, featured products |
| `/produk` | CatalogComponent | Prerender | Listing semua produk, filter & sort |
| `/produk/:slug` | ProductDetailComponent | **Server (SSR)** | Detail produk + SEO Schema.org |
| `/keranjang` | CartComponent | Prerender | Manajemen cart |
| `/checkout` | CheckoutComponent | Prerender | Multi-step checkout |
| `/pesanan/:id` | OrderTrackingComponent | **Server (SSR)** | Status & tracking order |
| `/masuk` | LoginComponent | Prerender | Halaman login |
| `/daftar` | RegisterComponent | Prerender | Halaman register |
| `/akun` | DashboardComponent | **Client** | Dashboard user (auth required) |

**Shared Components:**
- `navbar` — Navigasi utama dengan cart badge (computed signal) dan theme toggle.
- `footer` — Footer dengan informasi brand.
- `floating-buttons` — Tombol scroll-to-top, WhatsApp, dll.
- `exit-intent-popup` — Popup promosi saat user akan meninggalkan halaman.

**Core Services:**
- `AuthService` — Manajemen session (Signals), login/logout/register/refresh.
- `CartService` — State management cart (Signals + computed), termasuk guest cart.
- `CheckoutService` — Agregasi API shipping, orders, dan payments.
- `ProductsService` — Fetch produk, katalog, detail.
- `SeoService` — Set title, meta tags, Open Graph, dan Schema.org JSON-LD.
- `ThemeService` — Toggle dark/light mode, persist ke localStorage, respect system preference.

**Shared Pipes:**
- `CurrencyIdrPipe` — Format angka ke format Rupiah (Rp 25.000).
- `TruncatePipe` — Potong teks panjang dengan ellipsis.

---

## ⚙️ 4. TEKNOLOGI YANG DIGUNAKAN

### Backend
| Teknologi | Versi | Alasan Penggunaan |
|---|---|---|
| **NestJS** | Latest | Framework modular, TypeScript-first, DI pattern, mudah testing |
| **TypeORM** | 0.3.x | ORM yang mature untuk TypeScript, mendukung migrations & transactions |
| **MySQL** | 8.x | RDBMS yang reliabel dengan full ACID support |
| **JWT** (`@nestjs/jwt`) | - | Stateless auth, scalable |
| **bcryptjs** | - | Hashing password yang aman |
| **Helmet** | - | HTTP security headers otomatis |
| **cookie-parser** | - | Parsing HttpOnly cookie untuk refresh token |
| **@nestjs/throttler** | - | Rate limiting 100 req/60s di semua endpoint |
| **class-validator** | - | DTO validation dengan decorator |
| **class-transformer** | - | Auto-transform payload ke DTO instance |

### Frontend
| Teknologi | Versi | Alasan Penggunaan |
|---|---|---|
| **Angular** | 20 | Framework enterprise-grade, Signals, SSR built-in |
| **Angular SSR** | 20 | Server-Side Rendering untuk SEO |
| **Tailwind CSS** | v4 | Utility-first CSS, rapid development |
| **RxJS** | - | Reactive programming untuk HTTP streams |
| **Angular Signals** | - | State management yang efisien tanpa library tambahan |

### External APIs
| API | Kegunaan |
|---|---|
| **Midtrans** | Payment gateway — QRIS, Virtual Account, dll. |
| **RajaOngkir** | Kalkulasi ongkos kirim real-time ke seluruh Indonesia |

---

## 🗄️ 5. STRUKTUR DATABASE (22 ENTITY)

### Entity Relationship Map

```
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN: AUTH & USER                    │
│  [users] ←ManyToMany→ [roles] ←ManyToMany→ [permissions]  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN: CATALOG                          │
│  [products]                                                 │
│    ←ManyToMany→ [product_categories] (via product_category_map)
│    ←OneToMany→ [product_images]                             │
│    ←OneToMany→ [product_variants]                           │
│    ←OneToOne→  [inventories] (per product)                  │
│  [product_variants] ←OneToOne→ [inventories] (per variant) │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN: COMMERCE                         │
│  [carts] ←OneToOne→ [users]                                 │
│  [carts] ←OneToMany→ [cart_items]                           │
│  [wishlists] ←ManyToOne→ [users]                            │
│  [wishlists] ←ManyToOne→ [products]                         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN: ORDER & PAYMENT                  │
│  [orders] ←ManyToOne→ [users]                               │
│  [orders] ←OneToMany→ [order_items]                         │
│  [orders] ←OneToOne→  [payments]                            │
│  [orders] ←ManyToOne→ [shipping_addresses]                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN: SHIPPING                         │
│  [shipping_addresses] ←ManyToOne→ [users]                   │
│  [couriers] ←OneToMany→ [shipping_rates]                    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN: CONTENT & ADMIN                  │
│  [banners], [instagram_gallery], [coupons]                  │
│  [settings], [notifications], [audit_logs]                  │
└─────────────────────────────────────────────────────────────┘
```

### Detail Semua Entity

#### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | Primary key |
| `email` | VARCHAR(255) UNIQUE | Email login |
| `password` | VARCHAR(255) | BCrypt hash, `select: false` |
| `full_name` | VARCHAR(255) | Nama lengkap |
| `phone` | VARCHAR(20) | Nomor telepon |
| `avatar` | VARCHAR(255) | URL foto profil |
| `is_active` | BOOLEAN | Status akun |
| `refresh_token` | VARCHAR(500) | Token refresh JWT, `select: false` |
| `last_login_at` | TIMESTAMP | Waktu login terakhir |
| `created_at` | TIMESTAMP | Auto-generate |
| `updated_at` | TIMESTAMP | Auto-generate |

#### `roles` & `permissions`
- `roles`: `id`, `name` (admin/customer), `description`
- `permissions`: `id`, `name`, `description`
- Pivot: `user_roles` (user_id, role_id)

#### `products`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `slug` | VARCHAR(255) UNIQUE | URL-friendly identifier |
| `name` | VARCHAR(255) | Nama produk |
| `description` | TEXT | Deskripsi lengkap |
| `short_description` | TEXT | Deskripsi singkat untuk card |
| `price` | DECIMAL(12,2) | Harga dasar |
| `sale_price` | DECIMAL(12,2) | Harga diskon (nullable) |
| `weight` | INT | Berat dalam gram |
| `is_active` | BOOLEAN | Toggle aktif/nonaktif |
| `is_featured` | BOOLEAN | Tampil di halaman utama |
| `sold_count` | INT | Jumlah terjual (untuk sort popular) |
| `sku` | VARCHAR(255) | Stock keeping unit |
| `meta_title` | VARCHAR(255) | SEO title |
| `meta_description` | TEXT | SEO description |

#### `product_categories`
`id`, `slug` (UNIQUE), `name`, `image`, `description`, `sort_order`  
Pivot: `product_category_map` (product_id, category_id)

#### `product_images`
`id`, `product_id` (FK), `url`, `alt_text`, `is_primary`, `sort_order`

#### `product_variants`
`id` (UUID), `product_id` (FK), `name` (e.g. "150g", "450g"), `price`, `weight`, `sku`

#### `inventories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT PK | - |
| `product_id` | UUID FK | Null jika milik varian |
| `product_variant_id` | UUID FK | Null jika milik produk |
| `quantity` | INT | Total stok absolut |
| `reserved` | INT | Stok yang dikunci order PENDING |
| `low_stock_threshold` | INT | Batas peringatan stok rendah |

> **Pola Inventori:** Stok tersedia = `quantity - reserved`. Saat order dibuat, `reserved` naik. Saat pembayaran sukses, keduanya dikurangi. Saat order batal, hanya `reserved` yang dikurangi.

#### `carts`
`id` (UUID), `user_id` (FK, nullable), `session_id` (VARCHAR, untuk guest), `updated_at`

#### `cart_items`
`id`, `cart_id` (FK), `product_id` (FK), `product_variant_id` (FK, nullable), `quantity`

#### `wishlists`
`id`, `user_id` (FK), `product_id` (FK), `created_at`

#### `orders`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `order_number` | VARCHAR UNIQUE | Format: `FTC-YYYYMMDD-XXXX` |
| `user_id` | UUID FK | `ON DELETE SET NULL` |
| `status` | ENUM | pending, waiting_payment, paid, processing, shipped, delivered, cancelled |
| `subtotal` | DECIMAL(12,2) | Total produk tanpa ongkir |
| `shipping_cost` | DECIMAL(12,2) | Ongkos kirim |
| `discount` | DECIMAL(12,2) | Nilai diskon kupon |
| `total` | DECIMAL(12,2) | Subtotal + ongkir - diskon |
| `coupon_code` | VARCHAR(50) | Kode kupon yang digunakan |
| `notes` | TEXT | Catatan dari pembeli |
| `tracking_number` | VARCHAR(100) | Nomor resi kurir |
| `courier_name` | VARCHAR(100) | Nama kurir (JNE, dll) |
| `courier_service` | VARCHAR(100) | Layanan (REG, YES, dll) |
| `shipping_address_id` | UUID FK | `ON DELETE SET NULL` |

#### `order_items`
`id`, `order_id` (FK), `product_id` (FK), `product_name` (**snapshot**), `product_image` (**snapshot**), `price` (**snapshot**), `quantity`, `variant_name` (**snapshot**), `weight`

> **Snapshot Pattern:** Nama, harga, dan gambar produk di-snapshot saat order dibuat. Jika produk kemudian diedit atau dihapus, data order historis tetap akurat.

#### `payments`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `order_id` | UUID FK | `ON DELETE CASCADE` |
| `provider` | VARCHAR(50) | 'midtrans' |
| `external_id` | VARCHAR(255) | ID transaksi di Midtrans |
| `status` | ENUM | pending, success, failed, expired, refunded |
| `method` | VARCHAR(100) | 'qris', 'bca_va', dll |
| `amount` | DECIMAL(12,2) | Total yang harus dibayar |
| `gateway_response` | JSON | Raw response dari Midtrans |
| `paid_at` | TIMESTAMP | Waktu pembayaran sukses |
| `expired_at` | TIMESTAMP | Batas waktu pembayaran |
| `payment_url` | VARCHAR(500) | Snap URL Midtrans |
| `va_number` | VARCHAR(100) | Nomor virtual account |

#### `shipping_addresses`
`id` (UUID), `user_id` (FK), `full_name`, `phone`, `province`, `province_id`, `city`, `city_id`, `district`, `village`, `postal_code`, `full_address`, `is_default`

#### `couriers`
`id`, `code` (UNIQUE: 'jne', 'jnt'), `name`, `logo`, `is_active`

#### `shipping_rates`
`id`, `courier_id` (FK), `origin_city_id`, `destination_city_id`, `service`, `cost`, `etd`

#### `banners`
`id`, `title`, `subtitle`, `image_url`, `mobile_image_url`, `link_url`, `is_active`, `sort_order`, `start_date`, `end_date`

#### `coupons`
`id`, `code` (UNIQUE), `type` (percentage/fixed), `value`, `min_purchase`, `max_discount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `is_active`

#### `settings`
`id`, `key` (UNIQUE), `value` (TEXT), `type`, `group`

#### `notifications`
`id` (UUID), `user_id` (FK), `type`, `title`, `message`, `is_read`, `data` (JSON), `created_at`

#### `audit_logs`
`id` (UUID), `user_id` (FK), `action`, `entity_type`, `entity_id`, `old_values` (JSON), `new_values` (JSON), `ip_address`, `user_agent`, `created_at`

---

## 🔐 6. ANALISIS KEAMANAN

### Lapisan Keamanan yang Sudah Aktif

| Lapisan | Implementasi | Status |
|---|---|---|
| **Security Headers** | `helmet()` middleware — CSP, HSTS, X-Frame-Options, dll | ✅ Aktif |
| **Rate Limiting** | `@nestjs/throttler` — 100 request per 60 detik | ✅ Aktif |
| **Input Validation** | `class-validator` + `ValidationPipe` (whitelist, forbidNonWhitelisted) | ✅ Aktif |
| **Password Hashing** | `bcryptjs` salt 10 | ✅ Aktif |
| **JWT Auth** | `JwtAuthGuard` global, `@Public()` untuk bypass | ✅ Aktif |
| **Refresh Token Rotation** | Token tersimpan di DB, dapat di-invalidate via logout | ✅ Aktif |
| **SQL Injection** | TypeORM parameterized queries | ✅ Aktif |
| **XSS** | Angular built-in sanitization | ✅ Aktif |
| **CORS** | Dikonfigurasi hanya untuk `frontendUrl` | ✅ Aktif |
| **Race Condition / Oversell** | Pessimistic locking pada proses checkout dan webhook | ✅ Aktif |

### ⚠️ Catatan Keamanan Kritis

> **DEVELOPMENT CONFIG:** `synchronize: true` di TypeORM konfigurasi harus diubah ke `false` dan menggunakan migrations sebelum deploy ke production. Mode ini berbahaya di production karena bisa menghapus kolom yang tidak ada di entity.

> **Refresh Token:** Saat ini disimpan sebagai plain text di database. Untuk keamanan lebih tinggi, simpan sebagai hash BCrypt.

> **Admin Credentials:** Seeded admin password (`AdminFitcorn2026!`) di-hardcode di `auth.service.ts`. Sebaiknya diambil dari environment variable (`.env`).

### Potensi Vulnerability & Rekomendasi
1. **Tidak ada CSRF protection eksplisit** — Pertimbangkan CSRF token atau `SameSite=Strict`.
2. **Access Token di localStorage** — Rentan XSS. Alternatif: gunakan HttpOnly cookie untuk access token juga.
3. **Coupon Code belum divalidasi** — Bisa dieksploitasi untuk order gratis. Aktifkan validasi di `OrdersService`.

---

## 🚀 7. PERFORMA & SKALABILITAS

### Pola yang Sudah Diimplementasikan
- **Pessimistic Locking:** Mencegah oversell saat traffic tinggi.
- **Paralel Rate Calculation:** Semua kurir dikueri secara paralel dengan `Promise.all`.
- **Angular SSR:** Mempercepat First Contentful Paint (FCP) dan mendukung SEO.
- **Lazy Loading Routes:** Setiap halaman Angular di-load hanya saat diakses.
- **Computed Signals:** Kalkulasi cart hanya re-render jika state berubah.

### Potensi Bottleneck & Rekomendasi
1. **`findAll` Products:** JOIN ke categories, images, variants, inventory bisa lambat saat data besar. → Implementasi **Redis cache**.
2. **No Connection Pooling Config:** Konfigurasi eksplisit `extra: { connectionLimit: 20 }`.
3. **Image Delivery:** Gunakan CDN (Cloudflare Images, BunnyCDN) untuk produksi.
4. **RajaOngkir API Latency:** Cache response dengan Redis (TTL 1 jam).

---

## 📁 8. STRUKTUR FILE LENGKAP

```
fitcorn/
├── Dokumentasi.md                    # ← Dokumen ini
├── fitcorn-api/                      # NestJS Backend
│   └── src/
│       ├── main.ts                   # Entry point (Helmet, CORS, ValidationPipe)
│       ├── app.module.ts             # Root module (ThrottlerModule, JwtAuthGuard global)
│       ├── common/
│       │   ├── decorators/
│       │   │   ├── current-user.decorator.ts
│       │   │   └── public.decorator.ts
│       │   └── guards/
│       │       ├── jwt-auth.guard.ts
│       │       └── jwt-refresh.guard.ts
│       ├── config/
│       │   ├── app.config.ts
│       │   ├── database.config.ts
│       │   └── jwt.config.ts
│       ├── database/
│       │   └── all-entities.ts       # ⚠️ WAJIB daftarkan entity baru di sini
│       └── modules/
│           ├── auth/                 # Login, register, refresh, logout, seed admin
│           ├── users/                # Entity: User, Role, Permission
│           ├── products/             # CRUD produk, kategori, inventori, seed data
│           ├── cart/                 # Guest cart, member cart, merge
│           ├── wishlist/             # Simpan/hapus produk favorit
│           ├── orders/               # Checkout ACID, tracking, admin order mgmt
│           ├── payments/             # Midtrans integration, webhook handler
│           │   └── providers/
│           │       ├── midtrans.provider.ts
│           │       └── payment-provider.interface.ts
│           ├── shipping/             # RajaOngkir proxy, address management
│           │   └── providers/
│           │       ├── rajaongkir.provider.ts
│           │       └── shipping-provider.interface.ts
│           ├── coupons/              # CRUD kupon (integrasi ke order belum aktif)
│           ├── banners/              # CMS banner & Instagram gallery
│           ├── notifications/        # Entity notifikasi (service belum dibuat)
│           ├── settings/             # Key-value store konfigurasi (entity only)
│           └── admin/                # Entity audit log (service belum dibuat)
│
└── fitcorn-web/                      # Angular 20 Frontend (SSR)
    └── src/app/
        ├── app.routes.ts             # Client-side route definitions
        ├── app.routes.server.ts      # SSR render mode config per route
        ├── core/
        │   ├── guards/
        │   │   ├── auth.guard.ts     # Redirect ke /masuk jika belum login
        │   │   └── admin.guard.ts    # Redirect jika bukan admin
        │   ├── interceptors/
        │   │   ├── auth.interceptor.ts     # Inject Bearer token ke semua request
        │   │   └── error.interceptor.ts    # Handle 401 → auto refresh token
        │   ├── models/               # TypeScript interfaces (Product, Order, Cart, User)
        │   └── services/
        │       ├── auth.service.ts         # Signal-based auth state management
        │       ├── cart.service.ts         # Signal-based cart + computed values
        │       ├── checkout.service.ts     # HTTP calls shipping/orders/payments
        │       ├── products.service.ts     # HTTP calls catalog/detail
        │       ├── seo.service.ts          # Title, meta, OpenGraph, Schema.org
        │       └── theme.service.ts        # Dark/light mode toggle + persistence
        ├── features/
        │   ├── home/                       # Landing page
        │   ├── catalog/                    # Product listing + filter/sort
        │   ├── product-detail/             # Detail produk (SSR mode)
        │   ├── cart/                       # Keranjang belanja
        │   ├── checkout/                   # Multi-step checkout flow
        │   ├── order-tracking/             # Status order (SSR mode)
        │   ├── dashboard/                  # Akun user (CSR mode)
        │   └── auth/
        │       ├── login/
        │       └── register/
        └── shared/
            ├── components/
            │   ├── navbar/
            │   ├── footer/
            │   ├── floating-buttons/
            │   └── exit-intent-popup/
            └── pipes/
                ├── currency-idr.pipe.ts
                └── truncate.pipe.ts
```

---

## 🔌 9. API ENDPOINT REFERENCE

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/register` | Public | Registrasi user baru |
| POST | `/login` | Public | Login, return JWT tokens |
| POST | `/refresh` | RefreshToken | Refresh access token |
| POST | `/logout` | JWT | Logout, hapus refresh token |
| GET | `/me` | JWT | Get profil user aktif |

### Products (`/api/products`)
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/` | Public | List produk (pagination, filter, sort) |
| GET | `/featured` | Public | 8 produk unggulan |
| GET | `/:slug` | Public | Detail produk by slug |
| GET | `/:slug/related` | Public | Produk terkait |
| GET | `/categories` | Public | Semua kategori |
| POST | `/` | Admin | Buat produk baru |
| PATCH | `/:id` | Admin | Update produk |
| DELETE | `/:id` | Admin | Hapus produk |

### Cart (`/api/cart`)
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/` | JWT | Ambil cart user |
| POST | `/items` | JWT | Tambah item ke cart |
| PUT | `/items/:id` | JWT | Update kuantitas item |
| DELETE | `/items/:id` | JWT | Hapus item dari cart |
| DELETE | `/` | JWT | Kosongkan cart |
| GET | `/guest` | x-session-id header | Ambil cart guest |
| POST | `/guest/items` | x-session-id header | Tambah item guest |
| PUT | `/guest/items/:id` | x-session-id header | Update item guest |
| DELETE | `/guest/items/:id` | x-session-id header | Hapus item guest |
| POST | `/merge` | JWT | Merge guest cart ke user cart |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/` | JWT | Buat order baru (checkout) |
| GET | `/` | JWT | Riwayat order user |
| GET | `/:id` | JWT | Detail order |
| GET | `/:id/tracking` | Public | Status tracking |
| GET | `/admin/all` | Admin | Semua order (admin) |
| PATCH | `/admin/:id/status` | Admin | Update status order |
| PATCH | `/admin/:id/tracking` | Admin | Input nomor resi |

### Shipping (`/api/shipping`)
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/provinces` | JWT | Daftar provinsi |
| GET | `/cities/:provinceId` | JWT | Daftar kota per provinsi |
| POST | `/calculate` | JWT | Kalkulasi ongkir |
| GET | `/addresses` | JWT | Alamat user |
| POST | `/addresses` | JWT | Buat alamat baru |
| PUT | `/addresses/:id` | JWT | Update alamat |
| DELETE | `/addresses/:id` | JWT | Hapus alamat |
| PATCH | `/addresses/:id/default` | JWT | Set default address |

### Payments (`/api/payments`)
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/create` | JWT | Buat transaksi Midtrans |
| GET | `/:orderId/status` | JWT | Cek status pembayaran |
| POST | `/webhook` | Public | Handler webhook Midtrans |

---

## 🧠 10. AI HANDOVER CONTEXT

> **PERINGATAN UNTUK AI BERIKUTNYA — BACA SEBELUM MENGUBAH APAPUN**

### ⚠️ Area Kritis yang Tidak Boleh Dimodifikasi Sembarangan

1. **`OrdersService.createOrder`** — Seluruh logika berada dalam ACID transaction dengan pessimistic locking. Jika menambahkan fitur (mis. apply kupon), pastikan inject service baru dan panggil **di dalam** blok `try { ... }` sebelum `commitTransaction`.

2. **`all-entities.ts`** — Setiap entity TypeORM BARU yang dibuat WAJIB ditambahkan ke file ini. Jika tidak, TypeORM tidak akan membuat tabel dan akan terjadi `EntityMetadataNotFoundError` saat startup.

3. **`synchronize: true`** — Ini HANYA untuk development. Sebelum production: set ke `false`, buat migrations, dan jalankan `migrations:run`.

4. **Inventory Logic** — Pola `quantity - reserved = available stock` harus selalu konsisten. Saat menambah fitur order baru, pastikan mengikuti pola ini.

### Konteks Teknologi
- **Database:** MySQL 8.x via TypeORM 0.3.x. Gunakan `queryRunner` untuk transaksi.
- **Frontend:** Angular 20 **Standalone Components** (tidak ada NgModule).
- **State Management:** Gunakan **Angular Signals** (bukan BehaviorSubject/Store library).
- **Routing:** Tambahkan route baru di `app.routes.ts`. Jika menggunakan URL parameter, tambahkan juga di `app.routes.server.ts` dengan `RenderMode.Server`.
- **CSS:** Gunakan **Tailwind CSS v4** utility classes.
- **API URL:** Saat ini hardcoded ke `http://localhost:3000`. Untuk production, pindahkan ke `environment.ts`.

### TODO Prioritas Tinggi
- [ ] **Aktifkan validasi kupon di OrdersService** — Inject `CouponsService`, validasi kode, hitung diskon yang benar.
- [ ] **Ubah `synchronize: false` + buat migrations** — Sebelum production deployment.
- [ ] **Hashing refresh token** — Hash sebelum simpan ke DB, compare saat refresh.
- [ ] **Pindahkan API URL ke `environment.ts`** — Hapus semua hardcoded `http://localhost:3000`.
- [ ] **Buat NotificationsModule** — Controller + Service untuk CRUD notifikasi user.
- [ ] **Buat AdminModule** — Controller + Service untuk dashboard admin.
- [ ] **PM2 config** — Buat `ecosystem.config.js` untuk production deployment.
- [ ] **Redis Cache** — Cache hasil query katalog produk dan response RajaOngkir.

---

## 🧪 11. STRATEGI TESTING

### Unit Test (Rekomendasi)
| Target | Fungsi yang Perlu Di-test |
|---|---|
| `ProductsService` | `findAll` (filter, sort, pagination), `findOneBySlug`, `getFeatured` |
| `OrdersService` | `createOrder` (stok cukup, stok tidak cukup, race condition) |
| `PaymentsService` | `handleWebhook` (status SUCCESS, FAILED, EXPIRED) |
| `AuthService` | `register` (duplikat email), `login` (kredensial salah) |

### Integration Test
1. **Full Checkout Flow:** POST cart → POST order → POST payment → simulate webhook → GET order status.
2. **Stok Race Condition:** Simulasikan 2 request bersamaan dengan stok = 1, pastikan hanya 1 yang berhasil.
3. **Refresh Token Flow:** Login → expire access token → auto refresh → retry request.

### Perintah Test
```bash
# Unit test
cd fitcorn-api && npm run test

# E2E test
cd fitcorn-api && npm run test:e2e

# Test coverage
cd fitcorn-api && npm run test:cov
```

---

## 🚀 12. PANDUAN DEPLOYMENT (PRODUCTION)

### Prerequisites
- Ubuntu 22.04 / Debian 11
- Node.js 20 LTS
- MySQL 8.x
- Nginx
- PM2
- Domain + SSL (Let's Encrypt)

### Environment Variables (`.env`)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=fitcorn_user
DB_PASSWORD=<strong-password>
DB_NAME=fitcorn_db

# JWT
JWT_SECRET=<random-256-bit-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<different-random-secret>
JWT_REFRESH_EXPIRES_IN=7d

# App
APP_PORT=3000
NODE_ENV=production
FRONTEND_URL=https://fitcorn.com

# Integrations
MIDTRANS_SERVER_KEY=<midtrans-prod-key>
MIDTRANS_CLIENT_KEY=<midtrans-client-key>
RAJAONGKIR_API_KEY=<rajaongkir-key>
```

### Langkah Deployment Backend

```bash
# 1. Clone & Install
git clone https://github.com/wahyudi-komite/fitcorn-id.git fitcorn
cd fitcorn/fitcorn-api
npm ci --production

# 2. Build
npm run build

# 3. Jalankan dengan PM2
pm2 start dist/main.js --name "fitcorn-api"
pm2 save && pm2 startup
```

### Langkah Deployment Frontend

```bash
cd fitcorn/fitcorn-web
npm ci
npm run build:ssr

# Start SSR server
pm2 start dist/fitcorn-web/server/server.mjs --name "fitcorn-web"
```

### Konfigurasi Nginx

```nginx
server {
    listen 80;
    server_name fitcorn.com www.fitcorn.com;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

---

*Dokumen ini dibuat dari analisis source code aktual. Perbarui dokumen ini setiap kali ada perubahan arsitektur signifikan.*
