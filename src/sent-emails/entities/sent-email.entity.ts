import { Email } from 'src/emails/entities/email.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sent_email' })
export class SentEmail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProjectManager)
  projectManager: ProjectManager;

  @ManyToOne(() => Email)
  email: Email;

  @Column()
  object: string;

  @Column()
  message: string;

  @Column()
  sendingDate: Date;
}
