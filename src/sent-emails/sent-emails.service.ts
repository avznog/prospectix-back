import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Repository } from 'typeorm';
import { CreateSentEmailDto } from './dto/create-sent-email.dto';
import { ResearchParamsSentEmailsDto } from './dto/research-params-sent-emails.dto';
import { SentEmail } from './entities/sent-email.entity';

@Injectable()
export class SentEmailsService {

  constructor(
    @InjectRepository(SentEmail)
    private readonly sentEmailRepository: Repository<SentEmail>
  ) {}

  async findAllPaginated(researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, user: ProjectManager) {
    try {
      return await this.sentEmailRepository.find({
        relations: ["pm", "prospect", "prospect.activity","prospect.city","prospect.country", "prospect.phone","prospect.email", "prospect.website", "prospect.reminders","prospect.meetings","prospect.events","prospect.bookmarks"],
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL
          }
        },
        take: researchParamsSentEmailsDto.take,
        skip: researchParamsSentEmailsDto.skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les emails envoyés", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createSentEmailDto: CreateSentEmailDto, user: ProjectManager) : Promise<SentEmail> {
    try {
      createSentEmailDto.pm = user;
      return await this.sentEmailRepository.save(createSentEmailDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countSentEmails(user: ProjectManager) : Promise<number> {
    try {
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les mails", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
    try {
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les mails", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
