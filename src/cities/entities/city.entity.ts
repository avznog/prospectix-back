import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'city' })
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  zipcode: number;

  @OneToMany(() => Prospect, (prospect) => prospect.city, { lazy: true })
  prospects: Prospect[];
}
