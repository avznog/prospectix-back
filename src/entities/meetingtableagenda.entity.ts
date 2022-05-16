import { BaseEntity, Column, Entity } from "typeorm";

@Entity({ name: "meeting_table_entity" })
export class MeetingTableEntity extends BaseEntity{
    
    @Column()
    link: string;
}