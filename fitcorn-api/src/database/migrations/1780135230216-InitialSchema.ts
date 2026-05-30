import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780135230216 implements MigrationInterface {
  name = 'InitialSchema1780135230216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        avatar VARCHAR(255) NULL,
        is_active TINYINT NOT NULL DEFAULT 1,
        refresh_token VARCHAR(500) NULL,
        last_login_at TIMESTAMP NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Permissions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // User Roles (M2M)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id VARCHAR(36) NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        CONSTRAINT FK_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT FK_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Role Permissions (M2M)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        CONSTRAINT FK_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT FK_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Product Categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NULL,
        description VARCHAR(255) NULL,
        sort_order INT NOT NULL DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Products
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        sale_price DECIMAL(12,2) NULL,
        weight INT NOT NULL DEFAULT 0,
        is_active TINYINT NOT NULL DEFAULT 1,
        is_featured TINYINT NOT NULL DEFAULT 0,
        sold_count INT NOT NULL DEFAULT 0,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Product Images
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36) NULL,
        url VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255) NULL,
        is_primary TINYINT NOT NULL DEFAULT 0,
        sort_order INT NOT NULL DEFAULT 0,
        CONSTRAINT FK_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Product Variants
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        product_id VARCHAR(36) NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        weight INT NOT NULL DEFAULT 0,
        sku VARCHAR(255) NULL,
        CONSTRAINT FK_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Inventory
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inventories (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36) NULL UNIQUE,
        variant_id VARCHAR(36) NULL UNIQUE,
        quantity INT NOT NULL DEFAULT 0,
        reserved INT NOT NULL DEFAULT 0,
        low_stock_threshold INT NOT NULL DEFAULT 5,
        CONSTRAINT FK_inventories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT FK_inventories_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Product Categories M2M
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products_categories_product_categories (
        product_id VARCHAR(36) NOT NULL,
        product_category_id INT NOT NULL,
        PRIMARY KEY (product_id, product_category_id),
        CONSTRAINT FK_products_categories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT FK_products_categories_category FOREIGN KEY (product_category_id) REFERENCES product_categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Carts
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NULL UNIQUE,
        session_id VARCHAR(255) NULL,
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        CONSTRAINT FK_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Cart Items
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        cart_id VARCHAR(36) NULL,
        product_id VARCHAR(36) NULL,
        variant_id VARCHAR(36) NULL,
        quantity INT NOT NULL DEFAULT 1,
        CONSTRAINT FK_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        CONSTRAINT FK_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT FK_cart_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Wishlists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NULL,
        product_id VARCHAR(36) NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        CONSTRAINT FK_wishlists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT FK_wishlists_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Shipping Addresses
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS shipping_addresses (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        province VARCHAR(255) NOT NULL,
        province_id VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        city_id VARCHAR(255) NOT NULL,
        district VARCHAR(255) NOT NULL,
        village VARCHAR(255) NOT NULL,
        postal_code VARCHAR(255) NOT NULL,
        full_address TEXT NOT NULL,
        is_default TINYINT NOT NULL DEFAULT 0,
        CONSTRAINT FK_shipping_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Couriers
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS couriers (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(255) NULL,
        is_active TINYINT NOT NULL DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Shipping Rates
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS shipping_rates (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        courier_id INT NULL,
        service VARCHAR(255) NOT NULL,
        cost DECIMAL(12,2) NOT NULL,
        etd VARCHAR(255) NOT NULL,
        CONSTRAINT FK_shipping_rates_courier FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Orders
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        order_number VARCHAR(255) NOT NULL UNIQUE,
        user_id VARCHAR(36) NULL,
        status ENUM('pending','waiting_payment','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
        subtotal DECIMAL(12,2) NOT NULL,
        shipping_cost DECIMAL(12,2) NOT NULL,
        discount DECIMAL(12,2) NOT NULL DEFAULT 0,
        total DECIMAL(12,2) NOT NULL,
        coupon_code VARCHAR(255) NULL,
        notes TEXT NULL,
        tracking_number VARCHAR(255) NULL,
        courier_name VARCHAR(255) NULL,
        courier_service VARCHAR(255) NULL,
        shipping_address_id VARCHAR(36) NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        CONSTRAINT FK_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT FK_orders_address FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Order Items
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(36) NULL,
        product_id VARCHAR(36) NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(255) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        variant_name VARCHAR(255) NULL,
        weight INT NOT NULL DEFAULT 0,
        CONSTRAINT FK_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT FK_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Payments
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        order_id VARCHAR(36) NULL UNIQUE,
        provider VARCHAR(255) NOT NULL,
        external_id VARCHAR(255) NULL,
        status ENUM('pending','success','failed','expired','refunded') NOT NULL DEFAULT 'pending',
        method VARCHAR(255) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        gateway_response JSON NULL,
        paid_at TIMESTAMP NULL,
        expired_at TIMESTAMP NULL,
        payment_url VARCHAR(255) NULL,
        va_number VARCHAR(255) NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        CONSTRAINT FK_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Banners
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NULL,
        image_url VARCHAR(255) NOT NULL,
        mobile_image_url VARCHAR(255) NULL,
        link_url VARCHAR(255) NULL,
        is_active TINYINT NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        start_date DATETIME NULL,
        end_date DATETIME NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Instagram Gallery
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS instagram_gallery (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        caption TEXT NULL,
        post_url VARCHAR(255) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        is_active TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Coupons
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        type ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
        value DECIMAL(12,2) NOT NULL,
        min_purchase DECIMAL(12,2) NOT NULL DEFAULT 0,
        max_discount DECIMAL(12,2) NULL,
        usage_limit INT NULL,
        used_count INT NOT NULL DEFAULT 0,
        start_date DATETIME NULL,
        end_date DATETIME NULL,
        is_active TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Settings
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        key_name VARCHAR(255) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        type VARCHAR(255) NULL DEFAULT 'string',
        setting_group VARCHAR(255) NULL DEFAULT 'general',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Notifications
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NULL,
        type VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT NOT NULL DEFAULT 0,
        data JSON NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        CONSTRAINT FK_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Audit Logs
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NULL,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(255) NOT NULL,
        entity_id VARCHAR(255) NULL,
        old_values JSON NULL,
        new_values JSON NULL,
        ip_address VARCHAR(255) NULL,
        user_agent VARCHAR(255) NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        CONSTRAINT FK_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'audit_logs', 'notifications', 'settings', 'coupons', 'instagram_gallery',
      'banners', 'payments', 'order_items', 'orders', 'shipping_rates', 'couriers',
      'shipping_addresses', 'wishlists', 'cart_items', 'carts',
      'products_categories_product_categories', 'inventories', 'product_variants',
      'product_images', 'products', 'product_categories',
      'role_permissions', 'user_roles', 'permissions', 'roles', 'users',
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS \`${table}\`;`);
    }
  }
}
