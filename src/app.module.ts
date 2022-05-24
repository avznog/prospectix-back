import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginService } from './services/login/login.service';
import { GoalsService } from './services/goals/goals.service';
import { ProspectsService } from './services/prospects/prospects.service';
import { RemindersService } from './services/reminders/reminders.service';
import { MeetingsService } from './services/meetings/meetings.service';
import { UsersService } from './services/users/users.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, LoginService, GoalsService, ProspectsService, RemindersService, MeetingsService, UsersService],
})
export class AppModule {}
