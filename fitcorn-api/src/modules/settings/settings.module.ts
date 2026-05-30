import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSettingsController } from './admin-settings.controller';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
  ],
  controllers: [AdminSettingsController],
  exports: [TypeOrmModule],
})
export class SettingsModule {}
