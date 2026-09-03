import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Version(VERSION_NEUTRAL)
  @Get()
  getHello(): object {
    return { status: 'API is running' };
  }
}
