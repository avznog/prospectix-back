import { Prospect } from 'src/prospects/entities/prospect.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'email' })
export class Email {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.email, { lazy: true })
  sentEmails: SentEmail[];
}
