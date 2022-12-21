import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Mustache from 'mustache';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateMailTemplateDto } from './dto/create-mail-template.dto';
import { UpdateMailTemplateDto } from './dto/update-mail-template.dto';
import { MailTemplate } from './entities/mail-template.entity';
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

  async renderTemplate(idTemplate: number, pm: ProjectManager, to: string) {
    try {
      const template = await this.mailTemplateRepository.findOne({
        where: {
          id: idTemplate
        }
      });
      let outputMail = await fs.readFile("src/mail-templates/mail-structure.mustache", "utf-8");
      outputMail.replace("{{mail_content}}", template.content)

      const variables = {
        pm: {
          ...pm,
          nameCaps: pm.name.toUpperCase(),
          phoneToCall: pm.phone.replace(/ /g, "")
        },
        prospect: to
      }

      const renderedTemplate = Mustache.render(outputMail, variables)
      return renderedTemplate;
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de fabriquer le template du mail", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ! TO DELETE
  async test() {
    try {
      var t = {
        pm: {
          firstname: "Benjamin",
          name: "Gonzva".toUpperCase(),
          email: "bgonzva@juniorisep.com",
          phone: "06 84 65 34 54",
          phoneToCall: "06 84 65 34 54".replace(/ /g, "")
        },
        prospect: {
          companyName: "L'ecole durable"
        }
      }
      let template = await fs.readFile('src/mail-templates/templates/mail-template.mustache', "utf-8")
     
      var output = Mustache.render(template, t)
      // console.log(output)
      return output
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de générer les tempaltes", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
