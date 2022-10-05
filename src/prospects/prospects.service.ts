import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { City } from 'src/cities/entities/city.entity';
import { EventType } from 'src/constants/event.type';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { StageType } from 'src/constants/stage.type';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Event } from 'src/events/entities/event.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Website } from 'src/websites/entities/website.entity';
import { ILike, Repository, UpdateResult } from 'typeorm';
import prospectsScrapped from "../../all-prospects-domained.json";
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

    // create admin account
    await this.pmRepository.save(this.pmRepository.create({
      pseudo: "admin",
      admin: true,
      name: "admin",
      firstname: "admin",
      mail: "admin@juniorisep.com",
      tokenEmail: "",
      disabled: false,
    }));

    // Creating France country
    await this.countryRepository.save(this.countryRepository.create({
      name: "France"
    }));

    let cities = new Map<number, string>();
    let activities: string[] = [];
    let activitiesFiltered = [];

    // Creating the cities and activities arrays

    for(let prospect of prospectsScrapped) {
      // adding filtered cities to map
      if(!cities.has(+prospect.city.zipcode))
        cities.set(+prospect.city.zipcode, prospect.city.name.toLowerCase())

      // adding activities to array
      activities.push(prospect.activity.name) 
    }
    
    // Filtering activities
    activities.forEach((element) => {
      if (!activitiesFiltered.includes(element)) {
          activitiesFiltered.push(element);
      }
    });

    // Adding cities to DB
    for(let city of cities) {
      await this.cityRepository.save(this.cityRepository.create({
        name: city[1],
        zipcode: +city[0]
      }));
    }

    // Adding activities to db
    activitiesFiltered.forEach(activity => {
      this.activityRepository.save(this.activityRepository.create({
        name: activity
      }))
    })


    for(let prospect of prospectsScrapped){    
      // prospect basis
      const newProspect = {
        companyName: prospect.companyName,
        streetAddress: prospect.streetAddress,
        isBookmarked: false,
        comment: "",
        nbNo: 0,
        disabled: false,
        stage: StageType.RESEARCH,
        phone: {
          number: prospect.phone.number
        },
        website: {
          website: prospect.website ? prospect.website.website : ""
        },
        email: {
          email: ""
        },
        city: {
          name: "",
          zipcode: 0
        },
        activity: {
          name: ""
        },
        country: {
          id: 1,
          name: "France"
        }
      }

      // get city
      await this.cityRepository.findOne({
        where: {
          name: prospect.city.name.toLowerCase(),
          zipcode: +prospect.city.zipcode
        }
      }).then(city => {
        newProspect.city = city;
      });

      // get activity
      await this.activityRepository.findOne({
        where: {
          name: prospect.activity.name
        }
      }).then(activity => {
        newProspect.activity = activity;
      });

      // get country // ! default France
      await this.countryRepository.findOne({
        where: {
          name: "France"
        }
      }).then(country => {
        newProspect.country = country;
      })

      // save in db
      this.prospectRepository.save(this.prospectRepository.create(newProspect))
    }
      
    
    // Adding first event for prospects

    // fetching all prospects
    const prospects = await this.prospectRepository.find();

    // getting admin pm
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: "admin"
      }
    });

    // adding events
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
      return await this.prospectRepository.find({
        relations: ["activity", "city", "country", "events", "meetings", "phone", "reminders", "website", "email", "bookmarks", "bookmarks.pm"],
        where: [
          researchParamsProspectDto.keyword! == "" && researchParamsProspectDto.zipcode != -1000 && researchParamsProspectDto.activity! != "allActivities" && {
            stage: StageType.RESEARCH,
            disabled: false,
            city: {
              zipcode: researchParamsProspectDto.zipcode
            },
            activity: {
              name: researchParamsProspectDto.activity
            }
          },
          researchParamsProspectDto.keyword! == "" && researchParamsProspectDto.zipcode == -1000 && researchParamsProspectDto.activity! != "allActivities" && {
            stage: StageType.RESEARCH,
            disabled: false,
            activity: {
              name: researchParamsProspectDto.activity
            }
          },
          researchParamsProspectDto.keyword! == "" && researchParamsProspectDto.activity! == "allActivities" && researchParamsProspectDto.zipcode == -1000 && {
            stage: StageType.RESEARCH,
            disabled: false,
          },
          researchParamsProspectDto.keyword! == "" && researchParamsProspectDto.activity! == "allActivities" && researchParamsProspectDto.zipcode != -1000 && {
            stage: StageType.RESEARCH,
            disabled: false,
            city: {
                  zipcode: researchParamsProspectDto.zipcode
            }
          },
          researchParamsProspectDto.keyword! != "" && {
            stage: StageType.RESEARCH,
            disabled: false,
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`)
          },
          researchParamsProspectDto.keyword! != "" && {
            stage: StageType.RESEARCH,
            disabled: false,
            city: {
              name: ILike(`%${researchParamsProspectDto.keyword}%`)
            }
          },
          researchParamsProspectDto.keyword! != "" && {
            stage: StageType.RESEARCH,
            disabled: false,
            activity: {
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

  async disable(idProspect: number, reason: ReasonDisabledType) : Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto();
      updateProspectDto.disabled = true;
      updateProspectDto.reasonDisabled = reason;
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

  async countForDomains()  {
    try {
      let countDomains: [{}] = [{}];
      countDomains.pop()
      let activities = await this.activityRepository.find();
      for(let activity of activities) {
        let count = await this.prospectRepository.count({
          where: {
            activity: {
              id: activity.id
            }
          }
        });
        countDomains.push({ id: activity.id, count: count})
      }

      return countDomains
      
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les activités", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
