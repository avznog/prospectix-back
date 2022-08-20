import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { City } from 'src/cities/entities/city.entity';
import { ILike, Repository, UpdateResult } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { ResearchParamsProspectDto } from './dto/research-params-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
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

  async findAllPaginated(researchParamsProspectDto: ResearchParamsProspectDto) : Promise<Prospect[]> {
    try {
      return await this.prospectRepository.find({
        relations: ["activity","city","country","events","meetings","phone","reminders","website", "email", "bookmarks","bookmarks.pm"],
        where : [
          { 
            disabled: false,
            city: {
              name: researchParamsProspectDto.city
            },
            activity: {
              name: researchParamsProspectDto.activity
            },
            phone: {
              number: ILike(`%${researchParamsProspectDto.keyword}%`)
            }
          },
          { 
            disabled: false,
            city: {
              name: researchParamsProspectDto.city
            },
            activity: {
              name: researchParamsProspectDto.activity
            },
            website: {
              website: ILike(`%${researchParamsProspectDto.keyword}%`)
            }
          },
          { 
            disabled: false,
            city: {
              name: researchParamsProspectDto.city
            },
            activity: {
              name: researchParamsProspectDto.activity
            },
            email: {
              email: ILike(`%${researchParamsProspectDto.keyword}%`)
            }
          },
          { 
            disabled: false,
            city: {
              name: researchParamsProspectDto.city
            },
            activity: {
              name: researchParamsProspectDto.activity
            },
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`)
          },
          { 
            disabled: false,
            city: {
              name: researchParamsProspectDto.city
            },
            activity: {
              name: researchParamsProspectDto.activity
            },
            streetAddress: ILike(`%${researchParamsProspectDto.keyword}%`)
          },
          { 
            disabled: false,
            city: {
              name: researchParamsProspectDto.city
            },
            activity: {
              name: researchParamsProspectDto.activity
            },
            country: {
              name: ILike(`%${researchParamsProspectDto.keyword}%`)
            }
          }
        ],
        take: researchParamsProspectDto.take,
        skip: researchParamsProspectDto.skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects", HttpStatus.INTERNAL_SERVER_ERROR)
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
