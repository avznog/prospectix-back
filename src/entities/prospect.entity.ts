import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./activity.entity";
import { Bookmark } from "./bookmark.entity";
import { City } from "./city.entity";
import { Country } from "./country.entity";
import { Email } from "./email.entity";
import { Meeting } from "./meeting.entity";
import { Phone } from "./phone.entity";
import { ProspectContact } from "./prospectcontact.entity";
import { Reminder } from "./reminder.entity";
import { Website } from "./website.entity";
import { Event } from "./event.entity";

@Entity({ name: "prospects" })
export class Prospect extends BaseEntity{

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    companyName: string;

    @ManyToOne(() => Activity)
    activity: string;

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
    lastEvent: string;

    @Column()
    comment: string;

    @Column()
    nbNo: number;

    @OneToMany(() => ProspectContact, prospectContact => prospectContact.prospect, { lazy: true })
    prospectContacts: ProspectContact[];

    @OneToMany(() => Meeting, meeting => meeting.prospect, { lazy: true })
    meetings: Meeting[];

    @OneToMany(() => Reminder, reminder => reminder.prospect, { lazy: true })
    reminders: Reminder[];

    @OneToMany(() => Email, email => email.prospect, { lazy: true })
    emails: Email[];

    @OneToMany(() => Phone, phone => phone.prospect, { lazy: true })
    phones: Phone[];

    @OneToMany(() => Website, website => website.prospect, { lazy: true })
    websites: Website[];

    @OneToMany(() => Bookmark, bookmark => bookmark.prospect, { lazy: true })
    bookmarks: Bookmark[];

    @OneToMany(() => Event, event => event.prospect, { lazy: true })
    events: Event[];
}