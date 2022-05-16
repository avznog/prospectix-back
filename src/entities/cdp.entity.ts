import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bookmark } from "./bookmark.entity";
import { Goal } from "./goal.entity";
import { Meeting } from "./meeting.entity";
import { Reminder } from "./reminder.entity";
import { SentEmail } from "./sentemail.entity";
import { Event } from "./event.entity";

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
    goals: Goal[];

    @OneToMany(() => Meeting, meeting => meeting.cdp, { lazy: true })
    meetings: Meeting[];

    @OneToMany(() => Reminder, reminder => reminder.cdp, { lazy: true })
    reminders: Reminder[];

    @OneToMany(() => SentEmail, sentEmail => sentEmail.cdp, { lazy:true })
    sentEmails: SentEmail[];

    @OneToMany(() => Bookmark, bookmark => bookmark.cdp, { lazy: true })
    bookmarks: Bookmark[];

    @OneToMany(() => Event, event => event.cdp, { lazy: true })
    events: Event[];
}