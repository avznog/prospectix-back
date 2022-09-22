import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { City } from 'src/cities/entities/city.entity';
import { EventType } from 'src/constants/event.type';
import { StageType } from 'src/constants/stage.type';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Event } from 'src/events/entities/event.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Website } from 'src/websites/entities/website.entity';
import { ILike, Repository, UpdateResult } from 'typeorm';
import prospectsScrapped from "../../prospectsScrapped.json";
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

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,

    @InjectRepository(Website)
    private readonly websiteRepository: Repository<Website>,

    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>

  ) {}

  async createFromScrapper() {
    
    const createProspectDto = new CreateProspectDto;
    let count = 0;
    for(let prospect of prospectsScrapped) {

      // default values
      createProspectDto.comment = "";
      createProspectDto.disabled = false;
      createProspectDto.nbNo = 0;
      createProspectDto.isBookmarked = false;

      // Basic informations
      createProspectDto.companyName = prospect.name;
      createProspectDto.website = new Website;
      createProspectDto.website.website = prospect.website ?? "";
      createProspectDto.email = new Email;
      createProspectDto.email.email = "";
      createProspectDto.phone = new Phone;
      createProspectDto.phone.number = prospect.phone.phone ? prospect.phone.phone : prospect.phone.mobile ? prospect.phone.mobile : "";
      createProspectDto.streetAddress = prospect.location.split(/\d{5}/)[0];
      let activity = prospect.domain;

      // France country by default
      createProspectDto.country = await this.countryRepository.findOne({
        where: {
          name: "France"
        }
      });


      // spliting location => zipcode and city
      let zipcode: number | RegExpMatchArray = prospect.location.match(/\d{5}/);
      let city = prospect.location.split(/\d{5}/)[1];


      // City affectation
      if(city){
        city = city.charAt(1).toUpperCase() + city.slice(2).toLowerCase();
      }
      let c: City;
      if(city && zipcode) {
        c = await this.cityRepository.findOne({
          where: {
            name: city,
            zipcode: +zipcode[0]
          }
        });
      } else if (city && !zipcode) {
        c = await this.cityRepository.findOne({
          where: {
            name: city
          }
        });
      } else if (!city && zipcode) {
        c = await this.cityRepository.findOne({
          where: {
            zipcode: +zipcode[0]
          }
        });
      } else {
        c = await this.cityRepository.findOne({
          where: {
            name: "",
            zipcode: -1
          }
        });
      }

      if(!c){
        createProspectDto.city = new City;
        createProspectDto.city.name = city;
        createProspectDto.city.zipcode = +zipcode[0];
      }else {
        createProspectDto.city = c;
      }


      // Activity affectation
      let a: Activity;
      if(!activity) {
        a = await this.activityRepository.findOne({
          where: {
            name: ""
          }
        });
      } else {
        activity = activity.includes(",") && activity.split(",")[0];
        a = await this.activityRepository.findOne({
          where: {
            name: activity
          }
        });
      }

      if(!a) {
        createProspectDto.activity = new Activity;
        createProspectDto.activity.name = activity
      } else {
        createProspectDto.activity = a;
      }

      this.prospectRepository.save(this.prospectRepository.create(createProspectDto));
    }
    
    
    // Adding first event for prospects
    const prospects = await this.prospectRepository.find();
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: "admin"
      }
    });

    for(let prospect of prospects) {
      this.eventRepository.save(this.eventRepository.create({
        date: new Date,
        description: "Prospect créé",
        prospect: prospect,
        type: EventType.CREATION,
        pm: pm
      }));
    } 
  }

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
      researchParamsProspectDto.zipcode = +researchParamsProspectDto.zipcode
      console.log(researchParamsProspectDto)
      return await this.prospectRepository.find({
        
        relations: ["activity", "city", "country", "events", "meetings", "phone", "reminders", "website", "email", "bookmarks", "bookmarks.pm"],
        where: [
          researchParamsProspectDto.zipcode != -1000 && researchParamsProspectDto.activity! != "allActivities" && {
            stage: StageType.RESEARCH,
            city: {
              zipcode: researchParamsProspectDto.zipcode
            },
            activity: {
              name: researchParamsProspectDto.activity
            }
          },
          researchParamsProspectDto.zipcode == -1000 && researchParamsProspectDto.activity! != "allActivities" && {
            stage: StageType.RESEARCH,
            activity: {
              name: researchParamsProspectDto.activity
            }
          },
          researchParamsProspectDto.activity! == "allActivities" && researchParamsProspectDto.zipcode == -1000 && {
            stage: StageType.RESEARCH
          },
          researchParamsProspectDto.activity! == "allActivities" && researchParamsProspectDto.zipcode != -1000 && {
            stage: StageType.RESEARCH,
            city: {
              zipcode: researchParamsProspectDto.zipcode
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

  async updateAllProspect(idProspect: number, updateProspectDto: UpdateProspectDto) : Promise<UpdateResult> {
    try {
      updateProspectDto.phone && await this.phoneRepository.update(updateProspectDto.phone.id, { number: updateProspectDto.phone.number })
      updateProspectDto.website && await this.websiteRepository.update(updateProspectDto.website.id, { website: updateProspectDto.website.website })
      updateProspectDto.email && await this.emailRepository.update(updateProspectDto.email.id, { email: updateProspectDto.email.email })
      updateProspectDto.city = await this.cityRepository.findOne({
        where: {
          name: updateProspectDto.city.name,
          zipcode: updateProspectDto.city.zipcode
        }
      });

      updateProspectDto.activity = await this.activityRepository.findOne({
        where: {
          name: updateProspectDto.activity.name
        }
      });
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
