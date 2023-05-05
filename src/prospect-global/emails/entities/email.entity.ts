import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity, OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Email extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id de l'email",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Contenu de l'email",
    required: true
  })
  email: string;

  @OneToOne(() => Prospect, (prospect) => prospect.email)
  prospect: Prospect;

  @OneToOne(() => ProjectManager)
  pm: ProjectManager;
}
