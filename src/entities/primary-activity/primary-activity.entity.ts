import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SecondaryActivity } from "../secondary-activities/secondary-activity.entity";

@Entity()
export class PrimaryActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({default: null, nullable: true, type: 'decimal'})
  weight: number;

  @OneToMany(() => SecondaryActivity, (secondaryActivity: SecondaryActivity) => secondaryActivity.primaryActivity)
  secondaryActivities: SecondaryActivity[];

}