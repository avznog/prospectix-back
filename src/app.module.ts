import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reminder } from './reminders/entities/reminder.entity';
import { ProjectManager } from './project-managers/entities/project-manager.entity';
import { RemindersModule } from './reminders/reminders.module';
import { ProjectManagersModule } from './project-managers/project-managers.module';
import { ProspectsModule } from './prospects/prospects.module';
import { Prospect } from './prospects/entities/prospect.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "benjamingonzva",
      password: "postgres",
      database: "testAuthProspectix",
      synchronize: true,
      entities: [Reminder, ProjectManager, Prospect]
    }),
    ProjectManagersModule,
    RemindersModule,
    ProspectsModule
    ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
