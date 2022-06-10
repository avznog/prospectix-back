import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @Column({nullable: true})
  @Exclude()
  currentHashedRefreshToken?: string;
}
