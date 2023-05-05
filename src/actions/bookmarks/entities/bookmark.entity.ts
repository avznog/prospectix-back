import { ApiProperty } from '@nestjs/swagger';
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
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "ID de l'activité",
    required: true
  })
  id: number;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "Chef de projet à qui appartient le favoris",
    required: true
  })
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  @ApiProperty({
    description: "Prospect qui correspondont au favoris",
    required: true
  })
  prospect: Prospect;

  @Column()
  @ApiProperty({
    description: "Date de création du favoris",
    required: true
  })
  creationDate: Date;
}
