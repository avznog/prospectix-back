import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Email } from "./email.entity";
import { Phone } from "./phone.entity";
import { Prospect } from "./prospect.entity";
import { Website } from "./website.entity";

@Entity({name:"prospect_contact"})
export class ProspectContact extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Prospect)
    prospect: Prospect;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    position: string;

    @OneToMany(() => Email, email => email.prospectContact, { lazy: true })
    emails: Email[];

    @OneToMany(() => Phone, phone => phone.prospect, { lazy: true })
    phones: Phone[];

    @OneToMany(() => Website, website => website.prospectContact, { lazy:true })
    websites: Website[];

}