import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/settings')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminSettingsController {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  @Get()
  async getAll() {
    return this.settingRepository.find();
  }

  @Put()
  async updateBulk(@Body() settings: { [key: string]: string }) {
    for (const [key, value] of Object.entries(settings)) {
      // Find if setting key exists first to avoid invalid inserts or ignored keys
      const existing = await this.settingRepository.findOne({ where: { key } });
      if (existing) {
        existing.value = String(value);
        await this.settingRepository.save(existing);
      } else {
        // Create dynamically if it doesn't exist
        const newSetting = this.settingRepository.create({
          key,
          value: String(value),
          type: typeof value,
          group: 'general',
        });
        await this.settingRepository.save(newSetting);
      }
    }
    return {
      message: 'All system settings updated successfully',
      settings,
    };
  }
}
