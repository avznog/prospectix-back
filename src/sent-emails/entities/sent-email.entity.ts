import { Email } from 'src/emails/entities/email.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sent_email' })
export class SentEmail extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CDP)
  cdp: CDP;

  @ManyToOne(() => Email)
  email: Email;

  @Column()
  object: string;

  @Column()
  message: string;

  @Column()
  sendingDate: Date;
}
