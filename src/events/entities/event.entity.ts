import { ApiProperty } from '@nestjs/swagger';
import { EventType } from 'src/constants/event.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id de l'évènement",
    required: true
  })
  id: number;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "Chef de projet lié à l'évènement",
    required: true
  })
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  @ApiProperty({
    description: "Prospect lié à l'évènement",
    required: true
  })
  prospect: Prospect;

  @Column()
  @ApiProperty({
    description: "Type d'évènement",
    required: true
  })
  event: EventType;

  @Column()
  @ApiProperty({
    description: "Date de création de l'évènement",
    required: true
  })
  creationDate: Date;
}
