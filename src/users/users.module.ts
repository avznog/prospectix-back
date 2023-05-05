import { Module } from '@nestjs/common';
import { ProjectManagersModule } from './project-managers/project-managers.module';

@Module({
  imports: [ProjectManagersModule]
})
export class UsersModule {}
