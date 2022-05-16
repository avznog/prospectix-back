import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";

@Entity({ name: "prospects" })
export class Prospect extends BaseEntity{

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    companyName: string;

    @Column()
    activityDomain: string;

    @Column()
    phone: string;

    @Column()
    streetAddress: string;

    @Column()
    city: number;

    @Column()
    country: Country;

    @Column()
    website: string;

    @Column()
    email: string;

    @Column()
    lastEvent: string;

    @Column()
    comment: string;

    @Column()
    nbNo: number;
}