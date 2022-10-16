import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return "lol"
    //testing avec gitmoji avec restart
  }
}
