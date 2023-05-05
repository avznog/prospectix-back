import { ApiProperty } from '@nestjs/swagger';
import { EventType } from 'src/constants/event.type';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
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
    description: "description de l'évènement",
    required: true
  })
  description: string;

  @Column()
  @ApiProperty({
    description: "Date de création de l'évènement",
    required: true
  })
  date: Date;

  @Column()
  @ApiProperty({
    description: "Type de l'évènement",
    required: true
  })
  type: EventType;
}
