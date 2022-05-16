import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Prospect } from "./prospect.entity";

@Entity({name:"country"})
export class Country{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Prospect, prospect => prospect.country, { lazy: true })
    prospects: Prospect[];
}