import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { InjectEntityManager } from "@nestjs/typeorm";
import AppDataSource from "src/app-data-source";

// @InjectEntityManager(AppDataSource)
@Entity()
export class Cdp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @Column()
  admin: boolean;
  
  @Column({nullable: true})
  @Exclude()
  currentHashedRefreshToken?: string;
}