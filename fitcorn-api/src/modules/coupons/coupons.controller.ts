import { Controller, Post, Body } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Public()
  @Post('coupons/validate')
  async validate(@Body() body: { code: string; subtotal: number }) {
    return this.couponsService.validate(body.code, body.subtotal);
  }
}
