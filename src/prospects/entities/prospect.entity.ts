import { Reminder } from "src/reminders/entities/reminder.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Prospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @OneToMany(() => Reminder, (reminder) => reminder.prospect, {lazy: true})
  reminders: Promise<Reminder>
}
