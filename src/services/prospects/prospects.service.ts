import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from "fs";
import { EventType } from 'src/constants/event.type';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { StageType } from 'src/constants/stage.type';
import { CreateProspectDto } from 'src/dto/prospects/create-prospect.dto';
import { ResearchParamsProspectDto } from 'src/dto/prospects/research-params-prospect.dto';
import { UpdateProspectDto } from 'src/dto/prospects/update-prospect.dto';
import { City } from 'src/entities/cities/city.entity';
import { Country } from 'src/entities/countries/country.entity';
import { Email } from 'src/entities/emails/email.entity';
import { Event } from 'src/entities/events/event.entity';
import { Phone } from 'src/entities/phones/phone.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import { SearchParams } from 'src/entities/search-params/search-params.entity';
import { SecondaryActivity } from 'src/entities/secondary-activities/secondary-activity.entity';
import { Website } from 'src/entities/websites/website.entity';
import { ILike, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,

    @InjectRepository(SecondaryActivity)
    private readonly secondaryActivityRepository: Repository<SecondaryActivity>,

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
    private readonly emailRepository: Repository<Email>,

    @InjectRepository(SearchParams)
    private readonly searchParamRepository: Repository<SearchParams>

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
      if (prospect.secondaryActivity.name.trim().length == 0 || alreadyPhone.includes(prospect.phone.number))
        return false

      if (isNaN(+prospect.city.zipcode))
        return false

      alreadyPhone.push(prospect.phone.number)
      return true
    })
    console.timeEnd("filter")

    for (let prospect of prospectsScrapped) {
      // adding filtered cities to map
      if (!cities.has(+prospect.city.zipcode))
        cities.set(+prospect.city.zipcode, prospect.city.name[0].toUpperCase() + prospect.city.name.toLowerCase().slice(1))

      // adding activities to array
      if (prospect.secondaryActivity.name.trim().length)
        activitiesFiltered.add(prospect.secondaryActivity.name)
    }
    console.log("Chargement des villes et acti finies")

    // Adding cities to DB
    let added = 0
    const len = cities.size
    for (let city of cities) {
      added++
      if (added % 50 == 0)
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
      if (added % 50 == 0)
        console.log("acti", added, "/", len)
      this.secondaryActivityRepository.save(this.secondaryActivityRepository.create({
        name: activity
      }))
    })

    const activitiesCache: { [key: string]: SecondaryActivity } = {}
    const cityCache: { [key: string]: City } = {}
    const countryCache: { [key: string]: Country } = {}

    added = 0
    for (let prospect of prospectsScrapped) {
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
        secondaryActivity: {
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
          name: prospect.city.name[0].toUpperCase() + prospect.city.name.toLowerCase().slice(1),
          zipcode: +prospect.city.zipcode
        }
      }))

      newProspect.city = city;

      // get activity
      const activity = activitiesCache[prospect.secondaryActivity.name] ?? (activitiesCache[prospect.secondaryActivity.name] = await this.secondaryActivityRepository.findOne({
        where: {
          name: prospect.secondaryActivity.name
        }
      }))

      newProspect.secondaryActivity = activity;

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
      if (added % 50 == 0)
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
    for (let prospect of prospects) {
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

  async update(idProspect: number, updateProspectDto: UpdateProspectDto): Promise<UpdateResult> {
    try {
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier le prospect", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateAllProspect(idProspect: number, updateProspectDto: UpdateProspectDto): Promise<UpdateResult> {
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

      updateProspectDto.secondaryActivity && (
        updateProspectDto.secondaryActivity = await this.secondaryActivityRepository.findOne({
          where: {
            name: updateProspectDto.secondaryActivity.name
          }
        })
      );
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier le prospect", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateByCity(idProspect: number, cityName: string): Promise<UpdateResult> {
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
      throw new HttpException("impossible de modifier la ville du prospect", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateBySecondaryActivity(idProspect: number, activityName: string): Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto()
      const secondaryActivity = await this.secondaryActivityRepository.findOne({
        where: {
          name: activityName
        }
      });
      updateProspectDto.secondaryActivity = secondaryActivity;
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier le domaine d'acitvité du prospect", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async disable(idProspect: number, reason: ReasonDisabledType): Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto();
      updateProspectDto.disabled = true;
      updateProspectDto.reasonDisabled = reason;
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de désactiver le prospect", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async enable(idProspect: number): Promise<UpdateResult> {
    try {
      const updateProspectDto = new UpdateProspectDto();
      updateProspectDto.disabled = false;
      return await this.prospectRepository.update(idProspect, updateProspectDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'activer le prospect demandé", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAllPaginated(researchParamsProspectDto: ResearchParamsProspectDto): Promise<{prospects: Prospect[], count: number}> {
    try {
      researchParamsProspectDto.searchParams = await this.searchParamRepository.findOne({where: {id: 1}});
      const whereParameters = 

        // ? ONLY KEYWORD
        researchParamsProspectDto.keyword && !researchParamsProspectDto.cityName && !researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && [
          

          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          },
          {
            phone: {
              number: ILike(`%${researchParamsProspectDto.keyword}%`)
            },
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          }

        // ? ONLY cityName
        ] || 
        researchParamsProspectDto.cityName && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.primaryActivity && [
          {
            city: {
              name: researchParamsProspectDto.cityName,
              version: researchParamsProspectDto.searchParams.versionCity
            },
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          },
        ] ||

        // ? ONLY PRIMARY ACTIVITY
        researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.cityName && [
          {
            secondaryActivity: Not(null) && {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                name: ILike(`%${researchParamsProspectDto.primaryActivity}%`),
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            },
            city: {
              version: researchParamsProspectDto.searchParams.versionCity
            },
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect
          }
        ] ||

        // ? SECONDARY ACTIVITY
        researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.cityName && researchParamsProspectDto.primaryActivity &&
        {
          secondaryActivity: {
            name: ILike(`%${researchParamsProspectDto.secondaryActivity}%`),
            version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
            primaryActivity: {
              name: ILike(`%${researchParamsProspectDto.primaryActivity}%`),
              version: researchParamsProspectDto.searchParams.versionPrimaryActivity
            }
          },
          stage: StageType.RESEARCH,
          disabled: false,
          version: researchParamsProspectDto.searchParams.versionProspect,
          city: {
            version: researchParamsProspectDto.searchParams.versionCity
          }

        // ? THE REST
        } || !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.cityName && !researchParamsProspectDto.primaryActivity && [
          {
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          }
        ];

      // ! Count max prospects avalaible
      const countProspects= await this.prospectRepository.countBy(whereParameters);

      // ! find prospects
      const prospects =  await this.prospectRepository.find({
        relations: ["secondaryActivity", "secondaryActivity.primaryActivity", "city", "country", "events", "meetings", "phone", "reminders", "website", "email", "bookmarks", "bookmarks.pm"],
        where: whereParameters,
        take: researchParamsProspectDto.take,
        skip: researchParamsProspectDto.skip,
        order: {
          phone: {
            number: "desc"
          }
        }
      });

      return {
        prospects: prospects,
        count: countProspects
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
