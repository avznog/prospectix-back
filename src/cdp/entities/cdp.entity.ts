import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cdp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @Column()
  admin: boolean;
}
