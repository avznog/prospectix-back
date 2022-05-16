import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"country"})
export class Country{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    countryName: string;
}