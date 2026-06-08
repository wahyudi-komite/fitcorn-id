# Graph Report - fitcorn-id  (2026-06-08)

## Corpus Check
- 185 files · ~166,173 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1388 nodes · 2574 edges · 119 communities (88 shown, 31 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 160 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46276d13`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]

## God Nodes (most connected - your core abstractions)
1. `User` - 89 edges
2. `dependencies` - 42 edges
3. `AdminComponent` - 41 edges
4. `Product` - 38 edges
5. `Order` - 33 edges
6. `AdminService` - 31 edges
7. `AuthService` - 29 edges
8. `devDependencies` - 26 edges
9. `ButtonComponent` - 23 edges
10. `compilerOptions` - 22 edges

## Surprising Connections (you probably didn't know these)
- `AuditLog` --references--> `User`  [EXTRACTED]
  fitcorn-api/src/modules/admin/entities/audit-log.entity.ts → fitcorn-api/src/modules/users/entities/user.entity.ts
- `Cart` --references--> `CartItem`  [EXTRACTED]
  fitcorn-api/src/modules/cart/entities/cart.entity.ts → fitcorn-api/src/modules/cart/entities/cart-item.entity.ts
- `Notification` --references--> `User`  [EXTRACTED]
  fitcorn-api/src/modules/notifications/entities/notification.entity.ts → fitcorn-api/src/modules/users/entities/user.entity.ts
- `OrderItem` --references--> `Product`  [EXTRACTED]
  fitcorn-api/src/modules/orders/entities/order-item.entity.ts → fitcorn-api/src/modules/products/entities/product.entity.ts
- `Order` --references--> `User`  [EXTRACTED]
  fitcorn-api/src/modules/orders/entities/order.entity.ts → fitcorn-api/src/modules/users/entities/user.entity.ts

## Communities (119 total, 31 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (9): SocialAuthController, SocialAuthService, AdminCouponsController, CouponsController, CouponsModule, CouponsService, Public(), Coupon (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (12): Roles(), CreateProductDto, CreateVariantDto, UpdateProductDto, UpdateVariantDto, Setting, RolesGuard, AdminOrdersController (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (20): AvatarComponent, AvatarSize, BadgeComponent, BadgeSize, BadgeVariant, ButtonSize, ButtonVariant, CardComponent (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (4): CheckoutComponent, DashboardComponent, OrderTrackingComponent, CheckoutService

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (15): AdminModule, AuthModule, ALL_ENTITIES, AppDataSource, JwtAuthGuard, OrdersModule, PaymentsModule, ProductsModule (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (42): dependencies, axios, bcryptjs, bull, cache-manager, class-transformer, class-validator, cookie-parser (+34 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (6): AdminBannersController, BannersController, BannersModule, BannersService, Banner, InstagramGallery

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (8): ButtonComponent, GlassmorphismDirective, EmptyStateComponent, LoadingStateComponent, ConfirmModalConfig, ModalService, ProductsService, ThemeService

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (5): CheckboxComponent, RadioComponent, SelectComponent, SwitchComponent, TextareaComponent

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (10): CartModule, Order, OrderStatus, OrderItem, Payment, PaymentStatus, ShippingAddress, OrdersService (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-server, @angular/router (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (6): CartService, Cart, User, OrdersController, WishlistController, WishlistService

### Community 12 - "Community 12"
Cohesion: 0.24
Nodes (7): CartItem, Inventory, ProductCategory, Product, ProductImage, ProductVariant, Wishlist

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (5): OauthCallbackComponent, InputComponent, SocialProvider, TrustPoint, AuthService

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (5): AuthController, AuthService, LoginDto, RegisterDto, JwtRefreshGuard

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (6): ConfirmModalComponent, environment, ExitIntentPopupComponent, FloatingButtonsComponent, FooterComponent, AnalyticsService

### Community 16 - "Community 16"
Cohesion: 0.1
Nodes (10): App, appConfig, config, serverConfig, routes, serverRoutes, adminGuard(), authInterceptor() (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (26): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+18 more)

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (5): OAuthProfile, Permission, Role, JwtRefreshStrategy, JwtStrategy

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (9): BreadcrumbComponent, BreadcrumbItem, ColorSwatch, DesignSystemShowcaseComponent, QuantitySelectorComponent, TableColumn, TableComponent, TabItem (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 22 - "Community 22"
Cohesion: 0.15
Nodes (4): PaymentsController, PaymentsService, MidtransProvider, CreatePaymentResult

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (3): Notification, AbandonedCartScheduler, NotificationsService

### Community 26 - "Community 26"
Cohesion: 0.18
Nodes (8): Cart, CartItem, Inventory, Product, ProductCategory, ProductImage, ProductVariant, SeoService

### Community 27 - "Community 27"
Cohesion: 0.14
Nodes (9): BrandPillar, FaqItem, FlavorHighlight, JourneyStep, Testimonial, CurrencyIdrPipe, PriceTagComponent, ProductCardComponent (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.36
Nodes (15): Any, bool, int, Namespace, Path, str, collect_code_files(), find_semantic_payload() (+7 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (16): scripts, build, format, lint, migration:generate, migration:revert, migration:run, start (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.13
Nodes (15): schematics, skipTests, skipTests, typeSeparator, typeSeparator, skipTests, typeSeparator, addTypeToClassName (+7 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (14): build, serve, builder, configurations, defaultConfiguration, development, buildTarget, extractLicenses (+6 more)

### Community 37 - "Community 37"
Cohesion: 0.21
Nodes (3): ToastConfig, ToastService, ToastContainerComponent

### Community 41 - "Community 41"
Cohesion: 0.17
Nodes (11): cli, packageManager, prefix, projectType, root, sourceRoot, newProjectRoot, projects (+3 more)

### Community 42 - "Community 42"
Cohesion: 0.36
Nodes (3): CurrentUser, Courier, ShippingRate

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (11): options, assets, browser, outputMode, security, server, ssr, styles (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.25
Nodes (3): AdminDashboardController, AuditLog, NotificationsModule

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 54 - "Community 54"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (6): moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (6): Order, OrderItem, OrderStatus, Payment, PaymentStatus, ShippingAddress

### Community 59 - "Community 59"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 66 - "Community 66"
Cohesion: 0.4
Nodes (5): production, budgets, buildTarget, outputHashing, serviceWorker

### Community 67 - "Community 67"
Cohesion: 0.4
Nodes (4): angularApp, app, browserDistFolder, reqHandler

### Community 70 - "Community 70"
Cohesion: 0.5
Nodes (4): addTypeToClassName, skipTests, type, @schematics/angular:component

### Community 71 - "Community 71"
Cohesion: 0.5
Nodes (4): addTypeToClassName, skipTests, type, @schematics/angular:directive

### Community 72 - "Community 72"
Cohesion: 0.5
Nodes (3): assetGroups, index, $schema

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (3): skipTests, typeSeparator, @schematics/angular:resolver

### Community 79 - "Community 79"
Cohesion: 0.67
Nodes (3): skipTests, typeSeparator, @schematics/angular:interceptor

## Knowledge Gaps
- **241 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+236 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Community 11` to `Community 0`, `Community 1`, `Community 34`, `Community 35`, `Community 40`, `Community 9`, `Community 42`, `Community 12`, `Community 46`, `Community 14`, `Community 47`, `Community 18`, `Community 25`, `Community 63`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `Product` connect `Community 12` to `Community 38`, `Community 9`, `Community 11`, `Community 46`, `Community 29`, `Community 63`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `ProductDetailComponent` connect `Community 38` to `Community 7`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _241 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._