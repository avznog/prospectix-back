import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'activity' })
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

  @OneToMany(() => Prospect, (prospect) => prospect.activity, { lazy: true })
  @ApiProperty({
    description: "Prospect lié à l'activité",
    required: true
  })
  prospects: Prospect[];
}
