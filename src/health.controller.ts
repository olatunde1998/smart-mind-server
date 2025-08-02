import { Controller, Get } from '@nestjs/common';
import { skipAuth } from './helpers/skipAuth';

@Controller()
export default class HealthController {
  @skipAuth()
  @Get('/')
  public home() {
    return { status_code: 200, message: 'Welcome to Smart-mind API Server' };
  }

  @skipAuth()
  @Get('api')
  public api() {
    return { status_code: 200, message: 'Welcome to Smart-mind API Server' };
  }

  @skipAuth()
  @Get('api/v1')
  public v1() {
    return {
      status_code: 200,
      message: 'Welcome to version 1 of Smart-mind API Server',
    };
  }

  @skipAuth()
  @Get('health')
  public health() {
    return { status_code: 200, message: 'This is a healthy endpoint' };
  }
}
