import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'website' })
export class Website {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  website: string;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
