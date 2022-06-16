import { ApiProperty } from '@nestjs/swagger';
import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'meeting' })
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id du rendez-vous",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Type de rendez-vous",
    required: true
  })
  type: MeetingType = MeetingType.TEL_VISIO;

  @Column()
  @ApiProperty({
    description: "Date du rendez-vous",
    required: true
  })
  date: Date;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "Chef de projet lié au rendez-vous",
    required: true
  })
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  @ApiProperty({
    description: "Prospect lié au rendez-vous",
    required: true
  })
  prospect: Prospect;
}
