import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {
    process.stdout.write('AppController initialized\n');
  }

  @Get('test')
  getTest() {
    process.stdout.write('Test endpoint called\n');
    return {
      message: 'Hello from the backend!',
      timestamp: new Date().toISOString(),
    };
  }
}
