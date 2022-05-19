import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prospect } from './prospect.entity';
import { ProspectContact } from './prospectcontact.entity';
import { SentEmail } from './sentemail.entity';

@Entity({ name: 'email' })
export class Email extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @ManyToOne(() => ProspectContact)
  prospectContact: ProspectContact;

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.email, { lazy: true })
  sentEmails: SentEmail[];
}
