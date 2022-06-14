import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'agenda_link_entity' })
export class AgendaLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;
}
