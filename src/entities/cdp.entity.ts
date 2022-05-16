import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Goal } from "./goal.entity";

@Entity({name: "cdp"})
export class CDP extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    mail: string;

    @Column()
    pseudo: string;

    @Column()
    tokenEmail: string;

    @OneToMany(() => Goal, goal => goal.cdp, { lazy: true })
    goals: Promise<Goal[]>;
}