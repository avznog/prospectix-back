import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'activity' })
export class Activity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Prospect, (prospect) => prospect.activity, { lazy: true })
  prospects: Prospect[];
}
