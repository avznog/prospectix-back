import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Mustache from 'mustache';
import { SendEmailDto } from 'src/actions/sent-emails/dto/send-email.dto';
import { CreateMailTemplateDto } from 'src/mails/mail-templates/dto/create-mail-template.dto';
import { MailTemplate } from 'src/mails/mail-templates/entities/mail-template.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateMailTemplateDto } from './dto/update-mail-template.dto';
const fs = require("fs").promises


@Injectable()
export class MailTemplatesService {

  constructor(
    @InjectRepository(MailTemplate)
    private readonly mailTemplateRepository: Repository<MailTemplate>
  ) {}

  async findAllForMe(pm: ProjectManager) : Promise<MailTemplate[]> {
    try {
      return await this.mailTemplateRepository.find({
        where: {
          pm: {
            id: pm.id
          }
        },
        relations: ["pm"]
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer tous les mails", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(createMailTemplateDto: CreateMailTemplateDto, pm: ProjectManager) : Promise<MailTemplate> {
    try {
      createMailTemplateDto.pm = pm;
      return await this.mailTemplateRepository.save(this.mailTemplateRepository.create(createMailTemplateDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer un template", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: number) : Promise<DeleteResult> {
    try {
      return await this.mailTemplateRepository.delete(id);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le mail template", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateMailTemplateDto: UpdateMailTemplateDto) : Promise<MailTemplate> {
    try {
      await this.mailTemplateRepository.update(id, updateMailTemplateDto)
      return this.mailTemplateRepository.findOne({
        where: {
          id: id
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de modifier le mail tempalte", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() : Promise<MailTemplate[]> {
    try {
      return await this.mailTemplateRepository.find({
        relations: ["pm"]
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer la totalité des tempaltes", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ? generating the content of the mail to send
  async generateMailContent(pm: ProjectManager, sendEmailDto: SendEmailDto, mailTemplate: MailTemplate) {
    try {
      if(pm.phone && pm.phone != '')  {
        pm.phone = "+ 33 " + pm.phone.slice(1)
      } else {
        pm.phone = "+ 33 1 42 22 67 44" // ? Numéro de tel de Junior ISEP 
      }
      var variables = {
        pm: {
          ...pm,
          phoneToCall: pm.phone.replace(/ /g, ""),
          nameCaps: pm.name.toUpperCase(),
          profilePictureLink: pm.profilePictureLink != '' ? pm.profilePictureLink : "https://mcusercontent.com/33983ec548c38e7bcdc3d8a00/images/efe3b4a4-4a75-0e21-98a3-f1ed9573b5cc.png"
        },
        prospect: {
          ...sendEmailDto.prospect,
          clientName: sendEmailDto.clientName == '' ? '' : " " + sendEmailDto.clientName
        }
      }
      let structureTemplate = await fs.readFile('src/mails/templates/mail-structure.mustache', "utf-8")
      structureTemplate = structureTemplate.replace("{{mail_content}}", mailTemplate.content).split(`class="ql-align-justify"`).join(`style="text-align: justify;"`).split("<p>").join(`<p style="text-align: justify;">`)
      return Mustache.render(structureTemplate, variables)
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de générer les tempaltes", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
