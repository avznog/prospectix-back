import { Prospect } from "src/prospect-global/prospects/entities/prospect.entity";

export interface SendEmailDto {
  clientName: string;
  mailTemplateId: number;
  mailTemplateModified?: string;
  prospect: Prospect;
  object: string;
  withPlaquetteJisep: boolean;
  withPlaquetteSkema: boolean;
}