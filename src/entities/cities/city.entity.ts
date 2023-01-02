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
export class City extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id de la ville",
    required: true
  })
  id: number;

  @Column() 
  @ApiProperty({
    description: "Nom de la ville",
    required: true
  })
  name: string;

  @Column()
  @ApiProperty({
    description: "Code postal de la ville",
    required: true
  })
  zipcode: number;

  @OneToMany(() => Prospect, (prospect) => prospect.city)
  @ApiProperty({
    description: "Prospect correspondant à la ville",
    required: true
  })
  prospects: Prospect[];
}