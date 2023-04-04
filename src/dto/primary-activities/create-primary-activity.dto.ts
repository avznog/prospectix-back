import { SecondaryActivity } from "src/entities/secondary-activities/secondary-activity.entity";

export class CreatePrimaryActivityDto {
  name: string;
  weight: number;
  secondaryActivities: SecondaryActivity[];
}