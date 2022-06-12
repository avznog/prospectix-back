import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
