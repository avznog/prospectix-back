import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SecondaryActivity } from "../../secondary-activities/entities/secondary-activity.entity";
import { ApiProperty } from "@nestjs/swagger";
import { VersionPrimaryActivityType } from "src/constants/versions.type";

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

  @Column({default: null, nullable: true, type: 'float'})
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

  @Column({nullable: true})
  @ApiProperty({
    description: "Version de l'activité",
    required: false
  })
  version: VersionPrimaryActivityType;

  @Column({nullable: true})
  @ApiProperty({
    description: "Date de l'implémentation de l'activité",
    required: false
  })
  dateScraped: Date;

}