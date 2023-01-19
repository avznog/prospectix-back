import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn('increment') 
  @ApiProperty({
    description: "Id du pays",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Nom du pays",
    required: true
  })
  name: string;

  @OneToMany(() => Prospect, (prospect) => prospect.country)
  @ApiProperty({
    description: "Prospect lié au pays",
    required: true
  })
  prospects: Prospect[];
}
