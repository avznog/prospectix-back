import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Reminder } from "src/reminders/entities/reminder.entity";
@Entity()
export class ProjectManager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @Column()
  admin: boolean;

  @Column({nullable: true})
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => Reminder, (reminder) => reminder.pm, {lazy: true})
  reminders: Promise<Reminder[]>;
}
