import { Injectable, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Inventory } from './entities/inventory.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductImage)
    private imageRepository: Repository<ProductImage>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const productCount = await this.productRepository.count();
    if (productCount > 0) {
      return; // Already seeded
    }

    console.log('Seeding database with premium Fitcorn categories and products...');

    // 1. Create categories
    const categoriesData = [
      { slug: 'sweet-creamy', name: 'Sweet & Creamy', description: 'Luscious, melt-in-your-mouth sweet flavors' },
      { slug: 'salty-savory', name: 'Salty & Savory', description: 'Classic and modern salty spice blends' },
      { slug: 'spicy-lava', name: 'Spicy', description: 'Bold and fiery popcorn selections' },
    ];

    const categoriesMap: Record<string, ProductCategory> = {};
    for (const catData of categoriesData) {
      let cat = await this.categoryRepository.findOne({ where: { slug: catData.slug } });
      if (!cat) {
        cat = this.categoryRepository.create(catData);
        cat = await this.categoryRepository.save(cat);
      }
      categoriesMap[catData.slug] = cat;
    }

    // 2. Create products
    const productsData = [
      {
        slug: 'sweet-honey-butter',
        name: 'Sweet Honey Butter',
        description: 'Perfect balance of sweet natural honey and rich creamy butter coating. Hand-crafted with organic non-GMO corn, real forest honey, grass-fed French butter, and a hint of Madagascar vanilla. We popped it in small batches for premium freshness.',
        shortDescription: 'Sweet natural honey mixed with premium grass-fed French butter.',
        price: 25000,
        weight: 150,
        isFeatured: true,
        categorySlugs: ['sweet-creamy'],
        imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
        variants: [
          { name: 'Single Pack (150g)', price: 25000, weight: 150, sku: 'FC-SHB-SGL' },
          { name: 'Family Pack (450g)', price: 68000, weight: 450, sku: 'FC-SHB-FAM' }
        ]
      },
      {
        slug: 'classic-himalayan-salt',
        name: 'Classic Himalayan Salt',
        description: 'Lightly popped with pure organic coconut oil and dusted with pink Himalayan salt. Clean, simple, and satisfying. Perfect for health-conscious snackers who appreciate pure flavors without artificial enhancers.',
        shortDescription: 'Light organic coconut oil and fine pink Himalayan salt.',
        price: 22000,
        weight: 150,
        isFeatured: true,
        categorySlugs: ['salty-savory'],
        imageUrl: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=600&q=80',
        variants: [
          { name: 'Single Pack (150g)', price: 22000, weight: 150, sku: 'FC-CHS-SGL' },
          { name: 'Family Pack (450g)', price: 59000, weight: 450, sku: 'FC-CHS-FAM' }
        ]
      },
      {
        slug: 'spicy-cheese-lava',
        name: 'Spicy Cheese Lava',
        description: 'Bold cheddar cheese blended with a kick of fiery volcanic chili powder. Extremely popular for those who crave a hot, creamy, and crunchy savory experience.',
        shortDescription: 'Creamy cheddar cheese infused with hot volcanic chili.',
        price: 27000,
        weight: 150,
        isFeatured: true,
        categorySlugs: ['spicy-lava', 'salty-savory'],
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
        variants: [
          { name: 'Single Pack (150g)', price: 27000, weight: 150, sku: 'FC-SCL-SGL' },
          { name: 'Family Pack (450g)', price: 74000, weight: 450, sku: 'FC-SCL-FAM' }
        ]
      },
      {
        slug: 'dark-chocolate-caramel',
        name: 'Dark Chocolate Caramel',
        description: 'Drizzled with dark Belgian chocolate and coated in rich butter caramel. The ultimate sweet premium treat for late-night indulgence.',
        shortDescription: 'Premium dark Belgian chocolate and caramelized butter.',
        price: 29000,
        weight: 150,
        isFeatured: false,
        categorySlugs: ['sweet-creamy'],
        imageUrl: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=600&q=80',
        variants: [
          { name: 'Single Pack (150g)', price: 29000, weight: 150, sku: 'FC-DCC-SGL' },
          { name: 'Family Pack (450g)', price: 79000, weight: 450, sku: 'FC-DCC-FAM' }
        ]
      }
    ];

    for (const pData of productsData) {
      const product = new Product();
      product.slug = pData.slug;
      product.name = pData.name;
      product.description = pData.description;
      product.shortDescription = pData.shortDescription;
      product.price = pData.price;
      product.weight = pData.weight;
      product.isFeatured = pData.isFeatured;
      product.isActive = true;
      product.sku = pData.variants[0].sku;

      // Map categories
      product.categories = pData.categorySlugs.map(slug => categoriesMap[slug]).filter(Boolean);

      // Save product first to generate ID
      const savedProduct = await this.productRepository.save(product);

      // Save primary image
      const image = this.imageRepository.create({
        product: savedProduct,
        url: pData.imageUrl,
        altText: pData.name,
        isPrimary: true,
        sortOrder: 0
      });
      await this.imageRepository.save(image);

      // Save inventory
      const inventory = this.inventoryRepository.create({
        product: savedProduct,
        quantity: 120, // 120 bags initially in stock
        reserved: 0,
        lowStockThreshold: 10
      });
      await this.inventoryRepository.save(inventory);

      // Save variants
      for (const vData of pData.variants) {
        const variant = this.variantRepository.create({
          product: savedProduct,
          name: vData.name,
          price: vData.price,
          weight: vData.weight,
          sku: vData.sku
        });
        const savedVariant = await this.variantRepository.save(variant);

        // Variant inventory
        const variantInventory = this.inventoryRepository.create({
          variant: savedVariant,
          quantity: 60,
          reserved: 0,
          lowStockThreshold: 5
        });
        await this.inventoryRepository.save(variantInventory);
      }
    }

    console.log('Seeding premium Fitcorn database completed successfully!');
  }


  async create(dto: CreateProductDto): Promise<Product> {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true });

    const existing = await this.productRepository.findOne({ where: { slug } });
    if (existing) {
      throw new BadRequestException('Product with this slug already exists');
    }

    const product = this.productRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      shortDescription: dto.shortDescription,
      price: dto.price,
      salePrice: dto.salePrice,
      weight: dto.weight,
      isFeatured: dto.isFeatured ?? false,
      isActive: dto.isActive ?? true,
      sku: dto.sku,
    });

    if (dto.categoryIds?.length) {
      const categories = await this.categoryRepository.find({
        where: { id: In(dto.categoryIds) },
      });
      product.categories = categories;
    }

    const savedProduct = await this.productRepository.save(product);

    if (dto.imageUrl) {
      const image = this.imageRepository.create({
        product: savedProduct,
        url: dto.imageUrl,
        altText: dto.name,
        isPrimary: true,
        sortOrder: 0,
      });
      await this.imageRepository.save(image);
    }

    if (!dto.imageUrl) {
      const inventory = this.inventoryRepository.create({
        product: savedProduct,
        quantity: 0,
        reserved: 0,
        lowStockThreshold: 10,
      });
      await this.inventoryRepository.save(inventory);
    }

    if (dto.variants?.length) {
      for (const vData of dto.variants) {
        const variant = this.variantRepository.create({
          product: savedProduct,
          name: vData.name,
          price: vData.price,
          weight: vData.weight,
          sku: vData.sku,
        });
        const savedVariant = await this.variantRepository.save(variant);

        const variantInventory = this.inventoryRepository.create({
          variant: savedVariant,
          quantity: 0,
          reserved: 0,
          lowStockThreshold: 5,
        });
        await this.inventoryRepository.save(variantInventory);
      }
    }

    return this.findOneById(savedProduct.id);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneById(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.slug !== undefined) product.slug = dto.slug;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.shortDescription !== undefined) product.shortDescription = dto.shortDescription;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.salePrice !== undefined) product.salePrice = dto.salePrice;
    if (dto.weight !== undefined) product.weight = dto.weight;
    if (dto.isFeatured !== undefined) product.isFeatured = dto.isFeatured;
    if (dto.isActive !== undefined) product.isActive = dto.isActive;
    if (dto.sku !== undefined) product.sku = dto.sku;

    if (dto.categoryIds !== undefined) {
      const categories = await this.categoryRepository.find({
        where: { id: In(dto.categoryIds) },
      });
      product.categories = categories;
    }

    const savedProduct = await this.productRepository.save(product);

    if (dto.imageUrl !== undefined) {
      const existingImage = await this.imageRepository.findOne({
        where: { product: { id: savedProduct.id }, isPrimary: true },
      });
      if (existingImage) {
        existingImage.url = dto.imageUrl;
        await this.imageRepository.save(existingImage);
      } else {
        const image = this.imageRepository.create({
          product: savedProduct,
          url: dto.imageUrl,
          altText: dto.name || savedProduct.name,
          isPrimary: true,
          sortOrder: 0,
        });
        await this.imageRepository.save(image);
      }
    }

    if (dto.variants !== undefined) {
      await this.variantRepository.delete({ product: { id: savedProduct.id } });

      for (const vData of dto.variants) {
        const variant = this.variantRepository.create({
          product: savedProduct,
          name: vData.name,
          price: vData.price,
          weight: vData.weight,
          sku: vData.sku,
        });
        const savedVariant = await this.variantRepository.save(variant);

        const variantInventory = this.inventoryRepository.create({
          variant: savedVariant,
          quantity: 0,
          reserved: 0,
          lowStockThreshold: 5,
        });
        await this.inventoryRepository.save(variantInventory);
      }
    }

    return this.findOneById(savedProduct.id);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findOneById(id);
    await this.productRepository.remove(product);
  }

  async findAllAdmin(query: {
    search?: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      relations: { categories: true, images: true, variants: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { categories: true, images: true, variants: true, inventory: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findAll(query: {
    search?: string;
    category?: string; // slug
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'popular' | 'latest';
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const findOptions: any = {
      where: { isActive: true },
      relations: { categories: true, images: true, variants: true },
      take: limit,
      skip: skip,
    };

    // Filters
    if (query.search) {
      findOptions.where.name = Like(`%${query.search}%`);
    }

    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      findOptions.where.price = Between(query.minPrice, query.maxPrice);
    } else if (query.minPrice !== undefined) {
      findOptions.where.price = Between(query.minPrice, 999999999);
    } else if (query.maxPrice !== undefined) {
      findOptions.where.price = Between(0, query.maxPrice);
    }

    if (query.category) {
      // Find category first to get its products or filter using join
      const cat = await this.categoryRepository.findOne({ where: { slug: query.category } });
      if (cat) {
        // Find products belonging to this category
        // In TypeORM, filtering by relation can be done easily via QueryBuilder or relation maps
        // We'll use query builder for advanced relation query to make it robust
        return this.findByCategoryQuery(query, cat.id, page, limit);
      }
    }

    // Sorting
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'price_asc':
          findOptions.order = { price: 'ASC' };
          break;
        case 'price_desc':
          findOptions.order = { price: 'DESC' };
          break;
        case 'popular':
          findOptions.order = { soldCount: 'DESC' };
          break;
        case 'latest':
        default:
          findOptions.order = { createdAt: 'DESC' };
          break;
      }
    } else {
      findOptions.order = { createdAt: 'DESC' };
    }

    const [data, total] = await this.productRepository.findAndCount(findOptions);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async findByCategoryQuery(query: any, categoryId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.variants', 'variant')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('category.id = :categoryId', { categoryId });

    if (query.search) {
      qb.andWhere('product.name LIKE :search', { search: `%${query.search}%` });
    }

    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      qb.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      });
    }

    // Sort
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'price_asc':
          qb.orderBy('product.price', 'ASC');
          break;
        case 'price_desc':
          qb.orderBy('product.price', 'DESC');
          break;
        case 'popular':
          qb.orderBy('product.soldCount', 'DESC');
          break;
        case 'latest':
        default:
          qb.orderBy('product.createdAt', 'DESC');
          break;
      }
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    const [data, total] = await qb.take(limit).skip(skip).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug, isActive: true },
      relations: { categories: true, images: true, variants: true, inventory: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getFeatured(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true, isFeatured: true },
      relations: { categories: true, images: true, variants: true },
      take: 8,
    });
  }

  async getRelated(slug: string): Promise<Product[]> {
    const product = await this.findOneBySlug(slug);
    const categoryIds = product.categories.map((c) => c.id);

    if (categoryIds.length === 0) {
      return this.productRepository.find({
        where: { isActive: true },
        take: 4,
      });
    }

    return this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('product.id != :prodId', { prodId: product.id })
      .andWhere('category.id IN (:...categoryIds)', { categoryIds })
      .take(4)
      .getMany();
  }
}
