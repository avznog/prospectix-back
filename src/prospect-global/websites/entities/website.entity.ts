import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Website extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id du site internet",
    required: true
  })
  id: number;

  @OneToOne(() => Prospect, (prospect) => prospect.website)
  prospect: Prospect;

  @Column()
  website: string;
}
