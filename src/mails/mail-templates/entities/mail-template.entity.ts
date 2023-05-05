import { ApiProperty } from "@nestjs/swagger";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MailTemplate extends BaseEntity{

  @ApiProperty({
    required: true,
    description: "Id du template"
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    required: true,
    description: "Nom du template"
  })
  @Column({nullable: true})
  name: string;

  @ApiProperty({
    required: true,
    description: "Contenu du mail"
  })
  @Column({default: ""})
  content: string;

  @ApiProperty({
    required: true,
    description: "Pm à qui appartient le mail tempalte"
  })
  @ManyToOne(() => ProjectManager)
  pm: ProjectManager
}
