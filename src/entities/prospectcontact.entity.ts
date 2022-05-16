import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prospect } from "./prospect.entity";

@Entity({name:"prospect_contact"})
export class ProspectContact extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Prospect)
    prospect: Prospect;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    position: string;


}