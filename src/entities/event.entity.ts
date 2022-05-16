import { EventType } from "puppeteer";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CDP } from "./cdp.entity";

@Entity({name:"event"})
export class Event extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idCDP: CDP;

    @Column()
    prospect: number;

    @Column()
    event: EventType;

    @Column()
    creationDate: Date;
}