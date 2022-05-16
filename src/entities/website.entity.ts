import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"website"})
export class Website extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idOwner: number;

    @Column()
    website: string;
}