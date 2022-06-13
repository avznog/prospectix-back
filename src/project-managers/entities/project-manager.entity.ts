<<<<<<< HEAD
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Reminder } from 'src/reminders/entities/reminder.entity';
=======
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

>>>>>>> features/auth
@Entity()
export class ProjectManager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @Column()
  admin: boolean;
<<<<<<< HEAD

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => Reminder, (reminder) => reminder.pm, { lazy: true })
  reminders: Promise<Reminder[]>;
=======
  
  @Column({nullable: true})
  @Exclude()
  currentHashedRefreshToken?: string;
>>>>>>> features/auth
}
