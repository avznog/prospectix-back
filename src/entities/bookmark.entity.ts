import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CDP } from "./cdp.entity";
import { Prospect } from "./prospect.entity";

@Entity({name:"bookmark"})
export class Bookmark extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idCDP: CDP;

    @Column()
    idProspect: Prospect;

    @Column()
    creationDate: Date;
}