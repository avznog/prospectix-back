import { MeetingType } from "src/constants/meeting.type";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"meeting"})
export class Meeting extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    type: MeetingType = MeetingType.TEL_VISIO;

    @Column()
    date: Date;

    @Column()
    idCDP: number;

    @Column()
    idProspect: number;
}