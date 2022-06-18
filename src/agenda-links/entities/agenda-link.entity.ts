import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AgendaLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "ID de l'agenda",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Lien de l'agenda",
    required: true
  })
  link: string;
}
