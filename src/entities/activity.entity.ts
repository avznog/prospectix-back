import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Prospect } from "./prospect.entity";

@Entity({name:"activity"})
export class Activity extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Prospect, prospect => prospect.activityDomain, { lazy: true })
    prospect: Promise<Activity>;
}