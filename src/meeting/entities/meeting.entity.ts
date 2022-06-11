import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Meeting extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string

  @Column()
  date: string;
}
