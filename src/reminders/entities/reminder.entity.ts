import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id du rappel",
    required: true
  })
  id: number;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "Chef de projet lié au rappel",
    required: true
  })
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  @ApiProperty({
    description: "Prospect lié au rappel",
    required: true
  })
  prospect: Prospect;

  @Column()
  @ApiProperty({
    description: "Description du rappel",
    required: true
  })
  description: string;

  @Column()
  @ApiProperty({
    description: "Priorité du rappel",
    required: true
  })
  priority: number;

  @Column()
  @ApiProperty({
    description: "Date du rappel",
    required: true
  })
  date: Date;
}