import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'email' })
export class Email {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @OneToOne(() => Prospect)
  prospect: Prospect;

  @OneToOne(() => ProjectManager)
  projectManager: ProjectManager;

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.email, { lazy: true })
  sentEmails: SentEmail[];
}
