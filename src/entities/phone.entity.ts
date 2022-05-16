import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prospect } from "./prospect.entity";
import { ProspectContact } from "./prospectcontact.entity";

@Entity({name:"phone"})
export class Phone extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    number: string;

    @ManyToOne(() => Prospect)
    prospect: Prospect;

    @ManyToOne(() => ProspectContact)
    prospectContact: ProspectContact;
}