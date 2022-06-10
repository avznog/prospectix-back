import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TestCdp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @Column()
  admin: boolean;
}