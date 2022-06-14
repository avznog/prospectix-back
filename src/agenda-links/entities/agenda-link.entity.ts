import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'agenda_link_entity' })
export class AgendaLink extends BaseEntity {
  @Column()
  link: string;
}
