import { Column, PrimaryGeneratedColumn } from "typeorm";

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  identifier: string;

  @Column()
  password: string;
}
