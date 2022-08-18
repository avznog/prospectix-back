import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, ILike, Repository, UpdateResult } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/cities/entities/city.entity';
import { Activity } from 'src/activities/entities/activity.entity';
@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,

    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

  ) {}

  async create(createProspectDto: CreateProspectDto) {
    try {
      return await this.prospectRepository.save(createProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer le prospect", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginated(keyword: string, city: string, activity: string, take: number, skip: number) : Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","events","meetings","phone","reminders","website", "email", "bookmarks","bookmarks.pm"],
        where : [
          { 
            disabled: false,
            city: {
              name: city
            },
            activity: {
              name: activity
            },
            phone: {
              number: ILike(`%${keyword}%`)
            }
          },
          { 
            disabled: false,
            city: {
              name: city
            },
            activity: {
              name: activity
            },
            website: {
              website: ILike(`%${keyword}%`)
            }
          },
          { 
            disabled: false,
            city: {
              name: city
            },
            activity: {
              name: activity
            },
            email: {
              email: ILike(`%${keyword}%`)
            }
          },
          { 
            disabled: false,
            city: {
              name: city
            },
            activity: {
              name: activity
            },
            companyName: ILike(`%${keyword}%`)
          },
          { 
            disabled: false,
            city: {
              name: city
            },
            activity: {
              name: activity
            },
            streetAddress: ILike(`%${keyword}%`)
          },
          { 
            disabled: false,
            city: {
              name: city
            },
            activity: {
              name: activity
            },
            country: {
              name: ILike(`%${keyword}%`)
            }
          }
        ],
        take: take,
        skip: skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(idProspect: number): Promise<Prospect> {
    try {
      const prospects = await this.prospectRepository.findOne({
        relations: ["activity","city","country","events","meetings","phone","reminders","website", "email", "bookmarks","bookmarks.pm"],
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

  async findAllByBookmark(pmPseudo: string): Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","events","meetings","phone","reminders","website", "email", "bookmarks","bookmarks.pm"],
        where :{
          bookmarks: {
            pm: {
              pseudo: pmPseudo
            }
          }
        }
      });
    } catch (error) {
      throw new HttpException(
        'Aucun prospect ajouté en favori pour ce Chef de Projet',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(idProspect: number, updateProspectDto: UpdateProspectDto) : Promise<UpdateResult> {
    try {
      return await this.prospectRepository.update(idProspect, updateProspectDto);  
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier le prospect",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateByCity(idProspect: number, cityName: string) : Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto()
      const city = await this.cityRepository.findOne({
        where: {
          name: cityName
        }
      });
      updateProspectDto.city = city;
      return await this.prospectRepository.update(idProspect, updateProspectDto);  
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier la ville du prospect",HttpStatus.INTERNAL_SERVER_ERROR)
    } 
  }

  async updateByActivity(idProspect: number, activityName: string) : Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto()
      const activity = await this.activityRepository.findOne({
        where: {
          name: activityName
        }
      });
      updateProspectDto.activity = activity;
      return await this.prospectRepository.update(idProspect, updateProspectDto);  
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier le domaine d'acitvité du prospect",HttpStatus.INTERNAL_SERVER_ERROR)
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
