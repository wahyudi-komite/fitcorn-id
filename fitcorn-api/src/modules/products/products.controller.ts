import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: 'price_asc' | 'price_desc' | 'popular' | 'latest',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll({
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('featured')
  async getFeatured() {
    return this.productsService.getFeatured();
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @Get(':slug/related')
  async getRelated(@Param('slug') slug: string) {
    return this.productsService.getRelated(slug);
  }
}
