import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CDP } from "./cdp.entity";
import { Prospect } from "./prospect.entity";

@Entity({name:"reminder"})
export class Reminder extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => CDP)
    cdp: CDP;

    @ManyToOne(() => Prospect)
    prospect: Prospect;

    @Column()
    description: string;

    @Column()
    priority: number;

    @Column()
    date: Date;
}