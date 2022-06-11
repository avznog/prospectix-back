import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
}
