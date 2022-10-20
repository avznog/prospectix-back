import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  //  ? Cron tab every sunday
  @Cron("00 17 * * 0")
  slack() {
    console.log("Cron is working with " + new Date())
  } 
}
