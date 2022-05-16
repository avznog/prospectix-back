import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./activity.entity";
import { City } from "./city.entity";
import { Country } from "./country.entity";
import { ProspectContact } from "./prospectcontact.entity";

@Entity({ name: "prospects" })
export class Prospect extends BaseEntity{

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    companyName: string;

    @ManyToOne(() => Activity)
    activityDomain: string;

    @Column()
    phone: string;

    @Column()
    streetAddress: string;

    @ManyToOne(() => City)
    city: City;

    @ManyToOne(() => Country)
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

    @OneToMany(() => ProspectContact, prospectContact => prospectContact.prospect, { lazy: true })
    prospectContact: Promise<ProspectContact[]>;
}