import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Prospect } from "./prospect.entity";

@Entity({name:"prospect_contact"})
export class ProspectContact extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idProspect: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    position: string;
}