import { Module } from '@nestjs/common';
import { PrimaryActivitiesModule } from './primary-activities/primary-activities.module';
import { SecondaryActivitiesModule } from './secondary-activities/secondary-activities.module';

@Module({
  imports: [PrimaryActivitiesModule, SecondaryActivitiesModule]
})
export class ActivitiesModule {}
