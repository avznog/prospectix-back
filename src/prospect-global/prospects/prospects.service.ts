import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Event } from 'src/admin/events/entities/event.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { EventType } from 'src/constants/event.type';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { StageType } from 'src/constants/stage.type';
import { VersionCityType, VersionPrimaryActivityType, VersionProspectType, VersionSecondaryActivityType } from 'src/constants/versions.type';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { City } from 'src/prospect-global/cities/entities/city.entity';
import { Country } from 'src/prospect-global/countries/entities/country.entity';
import { Email } from 'src/prospect-global/emails/entities/email.entity';
import { Phone } from 'src/prospect-global/phones/entities/phone.entity';
import { CreateProspectDto } from 'src/prospect-global/prospects/dto/create-prospect.dto';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import { Website } from 'src/prospect-global/websites/entities/website.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { ILike, Not, Repository, UpdateResult } from 'typeorm';
import { ResearchParamsProspectDto } from './dto/research-params-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
const fs = require("fs")

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

  ) { }

  // async createFromScrapper() {

  //   // create admin account
  //   await this.pmRepository.save(this.pmRepository.create({
  //     pseudo: "admin",
  //     admin: true,
  //     name: "admin",
  //     firstname: "admin",
  //     mail: "admin@juniorisep.com",
  //     tokenGoogle: "",
  //     disabled: false,
  //     statsEnabled: false
  //   }));

  //   // Creating France country
  //   await this.countryRepository.save(this.countryRepository.create({
  //     name: "France"
  //   }));

  //   let cities = new Map<number, string>();
  //   let activitiesFiltered = new Set<string>();

  //   // Creating the cities and activities arrays

  //   console.log("json decode")
  //   console.time("json decode")

  //   let prospectsScrapped = JSON.parse(fs.readFileSync("allprospects.json").toString())

  //   console.timeEnd("json decode")

  //   console.log("Filtering prospects")
  //   console.time("filter")
  //   const alreadyPhone = []
  //   prospectsScrapped = (prospectsScrapped as any[]).filter(prospect => {
  //     if (prospect.secondaryActivity.name.trim().length == 0 || alreadyPhone.includes(prospect.phone.number))
  //       return false

  //     if (isNaN(+prospect.city.zipcode))
  //       return false

  //     alreadyPhone.push(prospect.phone.number)
  //     return true
  //   })
  //   console.timeEnd("filter")

  //   for (let prospect of prospectsScrapped) {
  //     // adding filtered cities to map
  //     if (!cities.has(+prospect.city.zipcode))
  //       cities.set(+prospect.city.zipcode, prospect.city.name[0].toUpperCase() + prospect.city.name.toLowerCase().slice(1))

  //     // adding activities to array
  //     if (prospect.secondaryActivity.name.trim().length)
  //       activitiesFiltered.add(prospect.secondaryActivity.name)
  //   }
  //   console.log("Chargement des villes et acti finies")

  //   // Adding cities to DB
  //   let added = 0
  //   const len = cities.size
  //   for (let city of cities) {
  //     added++
  //     if (added % 50 == 0)
  //       console.log("cities", added, "/", len)

  //     await this.cityRepository.save(this.cityRepository.create({
  //       name: city[1],
  //       zipcode: +city[0]
  //     }));
  //   }
  //   console.log("Sauvegarde des villes finies")

  //   added = 0
  //   // Adding activities to db
  //   activitiesFiltered.forEach(activity => {
  //     added++
  //     if (added % 50 == 0)
  //       console.log("acti", added, "/", len)
  //     this.secondaryActivityRepository.save(this.secondaryActivityRepository.create({
  //       name: activity
  //     }))
  //   })

  //   const activitiesCache: { [key: string]: SecondaryActivity } = {}
  //   const cityCache: { [key: string]: City } = {}
  //   const countryCache: { [key: string]: Country } = {}

  //   added = 0
  //   for (let prospect of prospectsScrapped) {
  //     // prospect basis
  //     const newProspect = {
  //       companyName: prospect.companyName,
  //       streetAddress: prospect.streetAddress,
  //       isBookmarked: false,
  //       comment: "",
  //       nbNo: 0,
  //       disabled: false,
  //       stage: StageType.RESEARCH,
  //       phone: {
  //         number: prospect.phone.number
  //       },
  //       website: {
  //         website: prospect.website ? prospect.website.website : ""
  //       },
  //       email: {
  //         email: ""
  //       },
  //       city: {
  //         name: "",
  //         zipcode: 0
  //       },
  //       secondaryActivity: {
  //         name: ""
  //       },
  //       country: {
  //         id: 1,
  //         name: "France"
  //       }
  //     }

  //     // get city
  //     const city = cityCache[prospect.city.zipcode] ?? (cityCache[prospect.city.zipcode] = await this.cityRepository.findOne({
  //       where: {
  //         name: prospect.city.name[0].toUpperCase() + prospect.city.name.toLowerCase().slice(1),
  //         zipcode: +prospect.city.zipcode
  //       }
  //     }))

  //     newProspect.city = city;

  //     // get activity
  //     const activity = activitiesCache[prospect.secondaryActivity.name] ?? (activitiesCache[prospect.secondaryActivity.name] = await this.secondaryActivityRepository.findOne({
  //       where: {
  //         name: prospect.secondaryActivity.name
  //       }
  //     }))

  //     newProspect.secondaryActivity = activity;

  //     // get country // ! default France
  //     const country = countryCache["France"] ?? (countryCache["France"] = await this.countryRepository.findOne({
  //       where: {
  //         name: "France"
  //       }
  //     }))

  //     newProspect.country = country;

  //     // save in db
  //     this.prospectRepository.save(this.prospectRepository.create(newProspect))

  //     added++
  //     if (added % 50 == 0)
  //       console.log("prospect", added, "/", len)
  //   }

  // }

  // async addProspectsv2part1() {
  //   // ! AJOUTER LES DOMAINES D'ACTIVITÉ
  //   try {
  //     console.log("started part 1")
  //     const d = new Date;
  //     // ! FIRST ADD ACTIVITIES
  //     // ? 1. ajouter les activités secondaires en base
  //     const secondayActivies: SecondaryActivity[] = JSON.parse(fs.readFileSync('./secondary-activities.json'))
  //     secondayActivies.forEach(async secondayActivity => {
  //       await this.secondaryActivityRepository.save(this.secondaryActivityRepository.create({
  //         name: secondayActivity.name,
  //         weight: null,
  //         weightCount: 0,
  //         version: VersionSecondaryActivityType.V2,
  //         dateScraped: d,
  //         primaryActivity: {
  //           id: secondayActivity.primaryActivity.id
  //         }
  //       }))
  //     })
  //     console.log("done part1")
  //   } catch (error) {
  //     console.log(error)
  //     throw new HttpException("error while adding prospects", HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }

  // async addProspectsv2part2() {
  //   try {

  //     // !AJOUTER LES PROSPECTS
  //     console.log("started part 2")
  //     const d = new Date;

  //     // ! THEN THIS 
  //     // ? 2. getting activities, phones, cities to allow to add them in the base
  //     const activities = await this.secondaryActivityRepository.find({ relations: ["primaryActivity"], where: { version: VersionSecondaryActivityType.V2 } })
  //     const phones = await this.phoneRepository.find();
  //     const cities = await this.cityRepository.find();

  //     // ? 3. getting all the new prospects to insert
  //     const prospects: Prospect[] = JSON.parse(fs.readFileSync('./prospects.json'));

  //     const phonesInDb = new Set<Phone>();

  //     // ? 3.1 admin account for events
  //     const admin = await this.pmRepository.findOne({ where: { pseudo: 'admin' } });

  //     console.log('starting insertion')
  //     // ? 4. insertion script
  //     prospects.forEach(async prospect => {

  //       // ? 4.2 assign city to prospect
  //       const c = cities.find(c => (c.zipcode === prospect.city.zipcode) && (c.version == VersionCityType.V2));
  //       // ? 4.1 assign activity to prospect
  //       prospect.secondaryActivity.name && (prospect.secondaryActivity = activities.find(activity => activity.name.toLowerCase() == prospect.secondaryActivity.name.toLowerCase()))

  //       // ? 4.3 check if phone alreay is in the database, so we know if we need to edit or add
  //       if ((prospect.phone.number && !phones.map(phone => phone.number).includes(prospect.phone.number)) && prospect.city && prospect.city.id && prospect.secondaryActivity && prospect.secondaryActivity.id && c) {
  //         try {
  //           const p = await this.prospectRepository.save({
  //             companyName: prospect.companyName,
  //             streetAddress: prospect.streetAddress,
  //             comment: '',
  //             nbNo: 0,
  //             disabled: false,
  //             stage: StageType.RESEARCH,
  //             archived: null,
  //             reasonDisabled: null,
  //             version: VersionProspectType.V2,
  //             dateScraped: d,
  //             secondaryActivity: {
  //               id: prospect.secondaryActivity.id,
  //               name: prospect.secondaryActivity.name,
  //               weight: null,
  //               weightCount: 0,
  //               dateScraped: d,
  //               version: VersionSecondaryActivityType.V2,
  //               primaryActivity: {
  //                 id: prospect.secondaryActivity.primaryActivity.id,
  //               }
  //             },
  //             isBookmarked: false,
  //             city: c,
  //             phone: {
  //               number: prospect.phone.number
  //             },
  //             website: {
  //               website: prospect.website.website ?? ''
  //             },
  //             email: {
  //               email: prospect.email.email ?? ''
  //             },
  //             country: {
  //               id: 1,
  //               name: "France"
  //             }
  //           })

  //           // ? creation of event
  //           await this.eventRepository.save(this.eventRepository.create({
  //             date: d,
  //             description: 'Prospect créé',
  //             pm: admin,
  //             prospect: p,
  //             type: EventType.CREATION
  //           }));
  //         } catch (error) {
  //           console.log(error)
  //         }

  //         // ? 4.3 Phone is in the database, so we need to edit the prospect
  //       } else {
  //         const currentProspect = prospects.find(p => p.phone.number == prospect.phone.number)
  //         prospect.phone.number && phonesInDb.add(currentProspect.phone);

  //         // ? check if the prospect is still in the search or in the bookmarks
  //         if (prospect.city && prospect.phone.number && currentProspect.stage == 0 || currentProspect.stage == 1 && prospect.secondaryActivity && prospect.secondaryActivity.name && prospect.secondaryActivity.id && c) {
  //           try {

  //             const p = await this.prospectRepository.save({
  //               ...currentProspect,
  //               companyName: prospect.companyName,
  //               streetAddress: prospect.streetAddress,
  //               disabled: false,
  //               archived: null,
  //               reasonDisabled: null,
  //               version: VersionProspectType.V2,
  //               secondaryActivity: prospect.secondaryActivity ?? currentProspect.secondaryActivity,
  //               website: {
  //                 website: prospect.website.website ?? currentProspect.website.website
  //               },
  //               city: c,
  //               country: {
  //                 id: 1,
  //                 name: "France"
  //               }
  //             })

  //             await this.eventRepository.save(this.eventRepository.create({
  //               date: d,
  //               description: 'Prospect mis à jour',
  //               pm: admin,
  //               prospect: p,
  //               type: EventType.UPDATE_PROSPECT
  //             }))
  //           } catch (error) {
  //             console.log(error)
  //           }
  //         }

  //       }
  //     })
  //     console.log('done part 2')
  //   } catch (error) {
  //     console.log(error)
  //     throw new HttpException("Error while adding prospects", HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

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
        date: moment().tz('Europe/Paris').toDate(),
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
      createProspectDto.dateScraped = moment(createProspectDto.dateScraped).tz('Europe/Paris').toDate();
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
      updateProspectDto.archived = new Date;
      updateProspectDto.stage = StageType.ARCHIVED;
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

  // good luck (Benjamin .Gonzva)
  async findAllPaginated(researchParamsProspectDto: ResearchParamsProspectDto): Promise<{ prospects: Prospect[], count: number }> {
    try {
      researchParamsProspectDto.searchParams = {id: 1, versionCity: VersionCityType.V2, versionPrimaryActivity: VersionPrimaryActivityType.V2, versionProspect: VersionProspectType.V2, versionSecondaryActivity: VersionSecondaryActivityType.V2};
      // ! find prospects
      const prospects = await this.prospectRepository.findAndCount({
        relations: ["secondaryActivity", "secondaryActivity.primaryActivity", "city", "country", "events", "meetings", "phone", "reminders", "website", "email", "bookmarks", "bookmarks.pm"],
        take: 20,
        skip: researchParamsProspectDto.skip,
        where: 

        // ? this is the entire seach parameters. Depending on which ResearchParamsProspectDto parameters are NOT NULL, we ask a different request to the database
        // ? It is very important to define WHICH PARAMETERS ARE NOT NULL because if not, it will take the wrong request
        // ? good luck (benjamin gonzva)

        // ? ONLY KEYWORD
        researchParamsProspectDto.keyword && !researchParamsProspectDto.city && !researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.zipcode && [
          
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
  
        // ? ONLY city
        ] || 
        researchParamsProspectDto.city && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.zipcode && [
          {
            city: {
              name: researchParamsProspectDto.city,
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
        // ? CITY AND ZIPCODE
        researchParamsProspectDto.city && researchParamsProspectDto.zipcode && !researchParamsProspectDto.keyword && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.primaryActivity && [
          {
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          }
        ]
        ||  
        // ? ONLY PRIMARY ACTIVITY
        researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.city && !researchParamsProspectDto.zipcode && [
          {
            secondaryActivity: Not(null) && {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                id: researchParamsProspectDto.primaryActivity,
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
        // ? KEYWORD && PRIMARY
        researchParamsProspectDto.keyword && researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.city && !researchParamsProspectDto.zipcode && [
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
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
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
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
              }
            }
          }

        ] ||
        // ? ZIPCODE && PRIMARY ACTIVITY
        researchParamsProspectDto.city && researchParamsProspectDto.zipcode && researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && [
          {
            secondaryActivity: Not(null) && {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                id: researchParamsProspectDto.primaryActivity,
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            },
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              zipcode: researchParamsProspectDto.zipcode
            },
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect
          }

        ] || 
        // ? ZIPCODE & KEYWORD
        researchParamsProspectDto.keyword && researchParamsProspectDto.city && researchParamsProspectDto.zipcode && !researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && [
          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
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
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
              }
            }
          }
        ] || 
        // ? KEYWORD & SECONDARY
        researchParamsProspectDto.keyword && researchParamsProspectDto.primaryActivity && researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.city && !researchParamsProspectDto.zipcode && [
          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              id: researchParamsProspectDto.secondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
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
              version: researchParamsProspectDto.searchParams.versionCity,
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              id: researchParamsProspectDto.secondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
              }
            }
          }
        ] ||
  
        // ? SECONDARY ACTIVITY
        researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.city && researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.zipcode &&
        {
          secondaryActivity: {
            id: researchParamsProspectDto.secondaryActivity,
            version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
            primaryActivity: {
              id: researchParamsProspectDto.primaryActivity,
              version: researchParamsProspectDto.searchParams.versionPrimaryActivity
            }
          },
          stage: StageType.RESEARCH,
          disabled: false,
          version: researchParamsProspectDto.searchParams.versionProspect,
          city: {
            version: researchParamsProspectDto.searchParams.versionCity
          }
  
        } || 
        // ? SECONDARY ACTIVITY && ZIPCODE 
        researchParamsProspectDto.primaryActivity && researchParamsProspectDto.secondaryActivity && researchParamsProspectDto.zipcode && researchParamsProspectDto.city && !researchParamsProspectDto.keyword && [
          {
            secondaryActivity: {
              id: researchParamsProspectDto.secondaryActivity,
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                id: researchParamsProspectDto.primaryActivity,
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            },
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              zipcode: researchParamsProspectDto.zipcode
            }
    
          }

        ] || 
        // ? CITY & PRIMARY & KEYWORD
        researchParamsProspectDto.city && researchParamsProspectDto.keyword && researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.zipcode && [
          
          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
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
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
              }
            }
          }
          // ? CITY AND PRIMARY ACTIVITY
        ] || researchParamsProspectDto.city && researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.zipcode && [
          {
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                id: researchParamsProspectDto.primaryActivity,
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          }
        ] || 
        // ? KEYWORD & PRIMARY & ZIPCODE
        researchParamsProspectDto.city && researchParamsProspectDto.zipcode && researchParamsProspectDto.keyword && researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && [
          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
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
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
              }
            }
          }
          // ? CITY AND KEYWORD
        ] || researchParamsProspectDto.keyword && researchParamsProspectDto.city && !researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.zipcode && [
          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city
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
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          }
          
          // ? CITY AND PRIMARY ACTIVITY AND SECONDARY ACTIVITY 
        ] || researchParamsProspectDto.city && researchParamsProspectDto.primaryActivity && researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.zipcode && [
          {
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              id: researchParamsProspectDto.secondaryActivity,
              primaryActivity: {
                id: researchParamsProspectDto.primaryActivity,
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity
              }
            }
          }
        // ? CITY, KEYWORD, PRIMARY ACTIVITY & SECONDARY ACTIVITY & ZIPCODE (ALL FILTERS)
        ] || researchParamsProspectDto.city && researchParamsProspectDto.keyword && researchParamsProspectDto.primaryActivity && researchParamsProspectDto.secondaryActivity && researchParamsProspectDto.zipcode && [
          {
            companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
            stage: StageType.RESEARCH,
            disabled: false,
            version: researchParamsProspectDto.searchParams.versionProspect,
            city: {
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              id: researchParamsProspectDto.secondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
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
              version: researchParamsProspectDto.searchParams.versionCity,
              name: researchParamsProspectDto.city,
              zipcode: researchParamsProspectDto.zipcode
            },
            secondaryActivity: {
              version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
              id: researchParamsProspectDto.secondaryActivity,
              primaryActivity: {
                version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                id: researchParamsProspectDto.primaryActivity
              }
            }
          }

          // ? CITY AND KEYWORD AND PRIMARY AND SECONDARY
        ] || researchParamsProspectDto.city && researchParamsProspectDto.keyword && researchParamsProspectDto.primaryActivity && researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.zipcode && [
            {
              companyName: ILike(`%${researchParamsProspectDto.keyword}%`),
              stage: StageType.RESEARCH,
              disabled: false,
              version: researchParamsProspectDto.searchParams.versionProspect,
              city: {
                version: researchParamsProspectDto.searchParams.versionCity,
                name: researchParamsProspectDto.city
              },
              secondaryActivity: {
                version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
                id: researchParamsProspectDto.secondaryActivity,
                primaryActivity: {
                  version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                  id: researchParamsProspectDto.primaryActivity
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
                version: researchParamsProspectDto.searchParams.versionCity,
                name: researchParamsProspectDto.city
              },
              secondaryActivity: {
                version: researchParamsProspectDto.searchParams.versionSecondaryActivity,
                id: researchParamsProspectDto.secondaryActivity,
                primaryActivity: {
                  version: researchParamsProspectDto.searchParams.versionPrimaryActivity,
                  id: researchParamsProspectDto.primaryActivity
                }
              }
            }
          
          // ? EVERYTHING (NO FILTER) 
        ] || !researchParamsProspectDto.secondaryActivity && !researchParamsProspectDto.keyword && !researchParamsProspectDto.city && !researchParamsProspectDto.primaryActivity && !researchParamsProspectDto.zipcode && [
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
        ]
  
  
      })
      return {
        prospects: prospects[0],
        count: prospects[1]
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
