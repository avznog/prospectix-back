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
      return await this.prospectRepository.find();
    } catch (error){
      console.log(error)
      throw new HttpException("Il y a eu une erreur dans la recherche de prospect",HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  async findOne(idProspect: number): Promise<Prospect> {
    try {
      const prospects = await this.prospectRepository.findOne({
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
            name: activityName
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
            name: cityName
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
              pseudo: pmName
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
            number: phoneProspect
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
            website: websiteProspect
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
      // console.log(addressProspect.replace("_"," "))
      return await this.prospectRepository.find({
        relations: ["activity","city","country","email","events","meetings","phone","reminders","website"],
        where: {
          streetAddress: addressProspect,
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

  async findAllByEmail(emailProspect: string): Promise<Prospect[]> {
    try {
      // return await this.prospectRepository.find({
      //   relations: ['email'],
      //   where: {
      //     email: {
      //       email: emailProspect
      //     },
      //   },
      // });
      return await this.prospectRepository.find({
        relations: ["email"],
        where: {
          id: 1
        }
      })
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Aucun prospect pour cet email',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByKeyWords(words: string[]) : Promise<Prospect[][]>{
    const allProspects : Prospect[][] = [[]];
    for(const word in words){
      const prospects = await this.prospectRepository.find({
        relations: ["city","activity","country","phone","email","website"],
        where: [
          {
            city: {
              name: Like(`%${word}%`)
            }
          },
          {
            companyName: Like(`%${word}%`)
          },
          {
            activity: {
              name: Like(`%${word}%`)
            }
          },
          {
            streetAddress: Like(`%${word}%`)
          },
          {
            country: {
              name: Like(`%${word}%`)
            }
          },
          {
            phone: {
              number: Like(`%${word}%`)
            }
          },
          {
            email: {
              email: Like(`%${word}%`)
            }
          },
          {
            website: {
              website: Like(`%${word}%`)
            }
          }
        ]
      });
      allProspects.push(prospects);
    }
    return allProspects;
  }

  async update(idProspect: number, updateProspectDto: UpdateProspectDto) : Promise<UpdateResult> {
    return this.prospectRepository.update(idProspect, updateProspectDto);
  }

  async disable(id: number, updateProspectDto: UpdateProspectDto) : Promise<UpdateResult> {
    this.prospectRepository.findOne({
      where: {
        id: id
      }
    });
    updateProspectDto.disabled = true;
    return await this.prospectRepository.update(id, updateProspectDto);
  }
}
