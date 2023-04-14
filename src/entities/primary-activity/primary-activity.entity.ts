import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SecondaryActivity } from "../secondary-activities/secondary-activity.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class PrimaryActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: "Le nom de la catégorie primaire",
    required: true
  })
  name: string;

  @Column({default: null, nullable: true, type: 'decimal'})
  @ApiProperty({
    description: "Le poids de la catégorie",
    required: false
  })
  weight: number;

  @OneToMany(() => SecondaryActivity, (secondaryActivity: SecondaryActivity) => secondaryActivity.primaryActivity)
  secondaryActivities: SecondaryActivity[];
  
  @Column({nullable: false, default: 0})
  @ApiProperty({
    description: "Le nombre d'appels comptés dans le poids de la catégorie",
    required: false
  })
  weightCount: number;

}