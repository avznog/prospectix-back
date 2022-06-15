import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'email' })
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

  @OneToOne(() => Prospect)
  prospect: Prospect;

  @OneToOne(() => ProjectManager)
  projectManager: ProjectManager;

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.email, { lazy: true })
  sentEmails: SentEmail[];
}
