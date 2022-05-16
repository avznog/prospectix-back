import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CDP } from "./cdp.entity";

@Entity({name: "sent_email"})
export class SentEmail extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idCDP: CDP;

    @Column()
    email: string;

    @Column()
    object: string;

    @Column()
    message: string;

    @Column()
    sendingDate: Date;
}