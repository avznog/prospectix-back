import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"phone"})
export class Phone extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idOwner: number;

    @Column()
    phoneNumber: string;
}