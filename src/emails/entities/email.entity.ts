import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Email extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id de l'email",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Contenu de l'email",
    required: true
  })
  email: string;

  @OneToOne(() => Prospect, (prospect) => prospect.email, { lazy: true })
  prospect: Prospect;

  @OneToOne(() => ProjectManager)
  pm: ProjectManager;

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.email, { lazy: true })
  sentEmails: SentEmail[];
}
