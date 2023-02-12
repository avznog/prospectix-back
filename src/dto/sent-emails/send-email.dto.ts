import { Prospect } from "src/entities/prospects/prospect.entity";

export interface sendEmailDto {
  clientName: string;
  mailTemplateId: number;
  mailTemplateModified?: string;
  prospect: Prospect;
  object: string;
  withPlaquetteJisep: boolean;
  withPlaquetteSkema: boolean;
}