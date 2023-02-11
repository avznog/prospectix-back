import { Prospect } from "src/entities/prospects/prospect.entity";

export interface sendEmailDto {
  clientName: string;
  mailTemplateId: number;
  prospect: Prospect;
  object: string;
  withPlaquetteJisep: boolean;
  withPlaquetteSkema: boolean;
}