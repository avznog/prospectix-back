import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'country' })
export class Country {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Prospect, (prospect) => prospect.country, { lazy: true })
  prospects: Prospect[];
}
