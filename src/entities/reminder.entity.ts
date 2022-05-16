import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"reminder"})
export class Reminder extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idUser: number;

    @Column()
    idProspect: number;

    @Column()
    descritpion: string;

    @Column()
    priority: number;

    @Column()
    date: Date;
}