import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"email"})
export class Email extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    idOwner: number;

    @Column()
    email: string;
}