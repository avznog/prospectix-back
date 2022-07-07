import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from 'src/phones/entities/phone.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Website } from 'src/websites/entities/website.entity';
import { City } from 'src/cities/entities/city.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,

    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,

    @InjectRepository(Website)
    private readonly websiteRepository: Repository<Website>,

    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}

  async create(createProspectDto: CreateProspectDto) {
    const prospect = await this.prospectRepository.findOne({
      where: {
        companyName: createProspectDto.companyName,
      },
    });
    if (!prospect)
      throw new HttpException("Ce prospect n'existe pas", HttpStatus.NOT_FOUND);
    return await this.prospectRepository.save(createProspectDto);
  }

  async findAll(): Promise<Prospect[]> {
    try{
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
      });
    } catch (error){
      console.log(error)
      throw new HttpException("Il y a eu une erreur dans la recherche de prospect",HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  async findOne(idProspect: number): Promise<Prospect> {
    try {
      const prospects = await this.prospectRepository.findOne({
        relations: ["activity","city","country","events","meetings","phone","reminders","website"],
        where: {
          id: idProspect,
        },
      });
      if(!prospects)
         throw new HttpException("Ce prospect n'existe pas",HttpStatus.NOT_FOUND);
      return prospects;
    } catch (error) {
      console.log(error)
      throw new HttpException(`Impossible de trouver le prospect pour l'id ${idProspect}`,HttpStatus.NOT_FOUND)
    }
  }

  async findAllByActivity(activityName: string): Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          activity: {
            name: Like(`%${activityName}%`)
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Aucun prospect pour cette activité',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByCity(cityName: string): Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          city: {
            name: Like(`%${cityName}%`)
          }
        },
      });
    } catch (error) {
      throw new HttpException(
        'Aucun prospect pour cette ville',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByBookmark(pmName: string): Promise<Prospect[]> {
    try {
      const prospects = await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          bookmarks: {
            pm: {
              pseudo: Like(`%${pmName}%`)
            },
          },
        },
      });

      if(!prospects)
        throw new HttpException("Ce prospect n'existe pas",HttpStatus.NOT_FOUND);
      return prospects;
    } catch (error) {
      throw new HttpException(
        'Aucun prospect ajouté en favori pour ce Chef de Projet',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByPhone(phoneProspect: string): Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          phone: {
            number: Like(`%${phoneProspect}%`)
          }
        }
      })
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Aucun prospect pour ce numéro de téléphone',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByWebsite(websiteProspect: string): Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          website: {
            website: Like(`%${websiteProspect}%`)
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Aucun prospect pour ce site internet',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByAddress(addressProspect: string): Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          streetAddress: Like(`%${addressProspect}%`),
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Aucun prospect pour cette adresse',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByEmail(emailProspect: string): Promise<Prospect> {
    try {
      const email = await this.emailRepository.findOne({
        where: {
          email: emailProspect
        }
      });

      return await this.prospectRepository.findOne({
        relations: ["activity","city","country","events","meetings","phone","reminders","website"],
        where: {
          id: email.id,
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Aucun prospect pour cet email',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  
  async update(idProspect: number, updateProspectDto: UpdateProspectDto) : Promise<UpdateResult> {
    try {
      return this.prospectRepository.update(idProspect, updateProspectDto);  
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier le prospect",HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  async disable(idProspect: number) : Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto();
      updateProspectDto.disabled = true;
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de désactiver le prospect",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async enable(idProspect: number) : Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto();
      updateProspectDto.disabled = false;
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'activer le prospect demandé",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
