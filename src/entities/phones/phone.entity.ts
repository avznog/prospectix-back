import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Phone extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id du numéro de téléphone",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "numéro de téléphone",
    required: true
  })
  number: string;
}
