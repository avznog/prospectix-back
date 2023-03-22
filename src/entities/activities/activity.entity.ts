import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Activity extends BaseEntity {
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

  @Column({default: null, nullable: true, type: 'decimal'})
  @ApiProperty({
    description: "Poids de la catégorie. Plus le poids est haut, plus la catégorie a de la valeur",
    required: true
  })
  weight: number;

  @OneToMany(() => Prospect, (prospect) => prospect.activity)
  @ApiProperty({
    description: "Prospect lié à l'activité",
    required: true
  })
  prospects: Prospect[];
}
