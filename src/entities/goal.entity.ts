import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CDP } from "./cdp.entity";

@Entity({name: "goal"})
export class Goal extends BaseEntity{

  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  isCyclic: boolean;
  
  @Column()
  deadline: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  achievementTotalSteps: number;

  @Column()
  currentAchievement: number;

  @ManyToOne(() => CDP)
  cdp: CDP;
  
}