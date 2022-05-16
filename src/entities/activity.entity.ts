import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"activity"})
export class Activity extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;
}