import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { PrimaryActivity } from '../primary-activity/primary-activity.entity';

@Entity()
export class SecondaryActivity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "ID de l'activité",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Nom de l'activité",
    required: true
  })
  name: string;

  @Column({ default: null, nullable: true, type: 'decimal' })
  @ApiProperty({
    description: "Poids de la catégorie. Plus le poids est haut, plus la catégorie a de la valeur",
    required: true
  })
  weight: number;

  @OneToMany(() => Prospect, (prospect) => prospect.secondaryActivity)
  @ApiProperty({
    description: "Prospect lié à l'activité",
    required: true
  })
  prospects: Prospect[];

  @Column({nullable: true})
  @ApiProperty({
  description: "Version du scraping, cela correspond aux différentes sessions de scraping qu'on a effectuées.\n v1 -> octobre 2022 / v2 -> mai 2023",
  required: true
  })
  version: string;

  @ManyToOne(() => PrimaryActivity, (primaryActivity: PrimaryActivity) => primaryActivity.secondaryActivities)
  primaryActivity: PrimaryActivity;
  
}
