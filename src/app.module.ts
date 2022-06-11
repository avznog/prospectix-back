import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderModule } from './reminder/reminder.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reminder } from './reminder/entities/reminder.entity';
import { CdpModule } from './cdp/cdp.module';
import { Cdp } from './cdp/entities/cdp.entity';
import { MeetingModule } from './meeting/meeting.module';
import { Meeting } from './meeting/entities/meeting.entity';

@Module({
  imports: [ReminderModule,
    CdpModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "benjamingonzva",
      password: "postgres",
      database: "testAuthProspectix",
      synchronize: true,
      entities: [Reminder, Cdp, Meeting]
    }),
    MeetingModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
