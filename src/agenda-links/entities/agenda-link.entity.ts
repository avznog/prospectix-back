import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'agenda_link_entity' })
export class MeetingTableEntity extends BaseEntity {
  @Column()
  link: string;
}
