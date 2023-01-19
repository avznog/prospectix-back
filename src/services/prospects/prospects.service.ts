import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from "fs";
import { EventType } from 'src/constants/event.type';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { StageType } from 'src/constants/stage.type';
import { CreateProspectDto } from 'src/dto/prospects/create-prospect.dto';
import { ResearchParamsProspectDto } from 'src/dto/prospects/research-params-prospect.dto';
import { UpdateProspectDto } from 'src/dto/prospects/update-prospect.dto';
import { Activity } from 'src/entities/activities/activity.entity';
import { City } from 'src/entities/cities/city.entity';
import { Country } from 'src/entities/countries/country.entity';
import { Email } from 'src/entities/emails/email.entity';
import { Event } from 'src/entities/events/event.entity';
import { Phone } from 'src/entities/phones/phone.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import { Website } from 'src/entities/websites/website.entity';
import { ILike, Repository, UpdateResult } from 'typeorm';

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
      tokenGoogle: "",
      disabled: false,
      statsEnabled: false
    }));

    // Creating France country
    await this.countryRepository.save(this.countryRepository.create({
      name: "France"
    }));

    let cities = new Map<number, string>();
    let activitiesFiltered = new Set<string>();

    // Creating the cities and activities arrays

    console.log("json decode")
    console.time("json decode")

    let prospectsScrapped = JSON.parse(fs.readFileSync("allprospects.json").toString())

    console.timeEnd("json decode")

    console.log("Filtering prospects")
    console.time("filter")
    const alreadyPhone = []
    prospectsScrapped = (prospectsScrapped as any[]).filter(prospect => {
      if(prospect.activity.name.trim().length == 0 || alreadyPhone.includes(prospect.phone.number))
        return false
      
      if(isNaN(+prospect.city.zipcode))
        return false

      alreadyPhone.push(prospect.phone.number)
      return true
    })
    console.timeEnd("filter")

    for(let prospect of prospectsScrapped) {
      // adding filtered cities to map
      if(!cities.has(+prospect.city.zipcode))
        cities.set(+prospect.city.zipcode, prospect.city.name[0].toUpperCase()+prospect.city.name.toLowerCase().slice(1))

      // adding activities to array
      if(prospect.activity.name.trim().length)
        activitiesFiltered.add(prospect.activity.name) 
    }
    console.log("Chargement des villes et acti finies")
    
    // Adding cities to DB
    let added = 0
    const len = cities.size
    for(let city of cities) {
      added++
      if(added % 50 == 0)
        console.log("cities", added, "/", len)

      await this.cityRepository.save(this.cityRepository.create({
        name: city[1],
        zipcode: +city[0]
      }));
    }
    console.log("Sauvegarde des villes finies")

    added = 0
    // Adding activities to db
    activitiesFiltered.forEach(activity => {
      added++
      if(added % 50 == 0)
        console.log("acti", added, "/", len)
      this.activityRepository.save(this.activityRepository.create({
        name: activity
      }))
    })

    const activitiesCache: {[key: string]: Activity} = {}
    const cityCache: {[key: string]: City} = {}
    const countryCache: {[key: string]: Country} = {}

    added = 0
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
      const city = cityCache[prospect.city.zipcode] ?? (cityCache[prospect.city.zipcode] = await this.cityRepository.findOne({
        where: {
          name: prospect.city.name[0].toUpperCase()+prospect.city.name.toLowerCase().slice(1),
          zipcode: +prospect.city.zipcode
        }
      }))
        
      newProspect.city = city;

      // get activity
      const activity = activitiesCache[prospect.activity.name] ?? (activitiesCache[prospect.activity.name] = await this.activityRepository.findOne({
        where: {
          name: prospect.activity.name
        }
      }))

      newProspect.activity = activity;

      // get country // ! default France
      const country = countryCache["France"] ?? (countryCache["France"] = await this.countryRepository.findOne({
        where: {
          name: "France"
        }
      }))

      newProspect.country = country;

      // save in db
      this.prospectRepository.save(this.prospectRepository.create(newProspect))

      added++
      if(added % 50 == 0)
        console.log("prospect", added, "/", len)
    }
      
  }

  async addEvents() {
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
    console.log("finished")
  }

  async create(createProspectDto: CreateProspectDto, pm: ProjectManager) {
    try {
      const newProspect = await this.prospectRepository.save(createProspectDto);
      this.eventRepository.save(this.eventRepository.create({
        date: new Date,
        description: "Prospect créé",
        prospect: newProspect,
        type: EventType.CREATION,
        pm: pm
      }));
      return newProspect
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
          },
          researchParamsProspectDto.keyword! != "" && {
            stage: StageType.RESEARCH,
            disabled: false,
            phone: {
              number: ILike(`%${researchParamsProspectDto.keyword}%`)
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
      updateProspectDto.phone && await this.phoneRepository.update(updateProspectDto.phone.id, { number: updateProspectDto.phone.number });
      updateProspectDto.website && await this.websiteRepository.update(updateProspectDto.website.id, { website: updateProspectDto.website.website });
      updateProspectDto.email && await this.emailRepository.update(updateProspectDto.email.id, { email: updateProspectDto.email.email });
      updateProspectDto.city && (
        updateProspectDto.city = await this.cityRepository.findOne({
          where: {
            name: updateProspectDto.city.name,
            zipcode: updateProspectDto.city.zipcode
          }
        })
      );

      updateProspectDto.activity && (
        updateProspectDto.activity = await this.activityRepository.findOne({
          where: {
            name: updateProspectDto.activity.name
          }
        })
      );
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

  async countForDomains() {
    try {
      let countDomains: [{}] = [{}];
      countDomains.pop()
      let activities = await this.activityRepository.find();
      for(let activity of activities) {
        let count = await this.prospectRepository.count({
          where: {
            activity: {
              id: activity.id
            },
            stage: StageType.RESEARCH
          }
        });
        countDomains.push({ id: activity.id, count: count})
      }
      return countDomains;
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les prospects par activités", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countForCities() {
    try {
      let countCities: [{}] = [{}];
      countCities.pop();
      let cities = await this.cityRepository.find();
      for(let city of cities) {
        let count = await this.prospectRepository.count({
          where: {
          city: {
            id: city.id
          }
        }});
        countCities.push({ id: city.id, count: count});
      }
      return countCities;
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les prospects par ville", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countProspects(researchParamsProspectDto: ResearchParamsProspectDto) : Promise<number> {
    try {
      return await this.prospectRepository.count({
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
          },
          researchParamsProspectDto.keyword! != "" && {
            stage: StageType.RESEARCH,
            disabled: false,
            phone: {
              number: ILike(`%${researchParamsProspectDto.keyword}%`)
            }
          }
        ]
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les prospect", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
