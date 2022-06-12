import { Column, Entity } from 'typeorm';

@Entity({ name: 'agenda_link_entity' })
export class AgendaLink {
  @Column()
  link: string;
}
