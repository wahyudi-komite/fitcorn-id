import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import slugify from 'slugify';

@Controller('admin/categories')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminCategoriesController {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  @Get()
  async getAll() {
    return this.categoryRepository.find({ order: { sortOrder: 'ASC' } });
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Post()
  async create(
    @Body() body: { name: string; description?: string; image?: string; sortOrder?: number },
  ) {
    if (!body.name) {
      throw new BadRequestException('Category name is required');
    }

    const slug = slugify(body.name, { lower: true, strict: true });

    // Check uniqueness
    const existing = await this.categoryRepository.findOne({ where: { slug } });
    if (existing) {
      throw new BadRequestException(`Category with slug '${slug}' already exists`);
    }

    const category = this.categoryRepository.create({
      name: body.name,
      slug,
      description: body.description,
      image: body.image,
      sortOrder: body.sortOrder ?? 0,
    });

    return this.categoryRepository.save(category);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: { name?: string; description?: string; image?: string; sortOrder?: number },
  ) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (body.name !== undefined) {
      category.name = body.name;
      category.slug = slugify(body.name, { lower: true, strict: true });
    }
    if (body.description !== undefined) category.description = body.description;
    if (body.image !== undefined) category.image = body.image;
    if (body.sortOrder !== undefined) category.sortOrder = body.sortOrder;

    return this.categoryRepository.save(category);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.remove(category);
    return { message: `Category with ID ${id} successfully deleted` };
  }
}
