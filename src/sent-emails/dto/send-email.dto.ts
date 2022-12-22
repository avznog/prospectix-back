import { Prospect } from "src/prospects/entities/prospect.entity";

export interface sendEmailDto {
  clientName: string;
  mailTemplateId: number;
  prospect: Prospect;
}