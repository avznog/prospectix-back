import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderModule } from './reminder/reminder.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reminder } from './reminder/entities/reminder.entity';
import { ProjectManagerModule } from './project-manager/project-manager.module';
import { ProjectManager } from './project-manager/entities/project-manager.entity';
import { ProjectManagerService } from './project-manager/project-manager.service';

@Module({
  imports: [ReminderModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "benjamingonzva",
      password: "postgres",
      database: "testAuthProspectix",
      synchronize: true,
      entities: [Reminder, ProjectManager]
    }),
    ProjectManagerModule
    ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
