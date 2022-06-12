import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'phone' })
export class Phone {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  number: string;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
