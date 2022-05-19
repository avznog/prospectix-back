import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prospect } from './prospect.entity';
import { ProspectContact } from './prospectcontact.entity';

@Entity({ name: 'website' })
export class Website extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  website: string;

  @ManyToOne(() => ProspectContact)
  prospectContact: ProspectContact;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
