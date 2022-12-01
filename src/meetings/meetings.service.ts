import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { MeetingType } from 'src/constants/meeting.type';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { ResearchParamsMeetingsDto } from './dto/research-parmas-meetings.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ){}

  async create(createMeetingDto: CreateMeetingDto, user: ProjectManager) : Promise<Meeting> {
    try {
      createMeetingDto.pm = user;
      return await this.meetingRepository.save(createMeetingDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer le rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async delete(idMeeting: number) : Promise<DeleteResult> {
    try {
      return await this.meetingRepository.delete(idMeeting);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markDone(idMeeting: number) : Promise<UpdateResult> {
    try {
      return await this.meetingRepository.update(idMeeting, { done: true });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de marquer le rendez-vous comme fait", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markUndone(idMeeting: number) : Promise<UpdateResult> {
    try {
      return await this.meetingRepository.update(idMeeting, { done: false });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de marquer le rendez vous comme n'étant pas encore fait", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginated(researchParamsMeetingsDto: ResearchParamsMeetingsDto, user: ProjectManager) : Promise<Meeting[]>{
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email", "prospect.meetings","prospect.bookmarks"],
        where: [
          researchParamsMeetingsDto.type != "" && {
            prospect: {
              stage: StageType.MEETING
            },
            pm: {
              pseudo: user.pseudo
            },
            done: researchParamsMeetingsDto.done  == "true" ? true : false,
            type: researchParamsMeetingsDto.type as MeetingType
          },
          researchParamsMeetingsDto.type == "" && {
            prospect: {
              stage: StageType.MEETING
            },
            pm: {
              pseudo: user.pseudo
            },
            done: researchParamsMeetingsDto.done  == "true" ? true : false,
          }
        ],
        order: {
          date: "ASC"
        },
        take: researchParamsMeetingsDto.take,
        skip: researchParamsMeetingsDto.skip
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllMeetingsDone(researchParamsMeetingsDto: ResearchParamsMeetingsDto, user: ProjectManager) : Promise<Meeting[]> {
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email", "prospect.meetings","prospect.bookmarks"],
        where: [
          researchParamsMeetingsDto.type != "" && {
            pm: {
              pseudo: user.pseudo
            },
            done: true,
            type: researchParamsMeetingsDto.type as MeetingType
          },
          researchParamsMeetingsDto.type == "" && {
            pm: {
              pseudo: user.pseudo
            },
            done: true
          }
        ],
        take: researchParamsMeetingsDto.take,
        skip: researchParamsMeetingsDto.skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les renddez vous effectués", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countMeetings(researchParamsMeetingsDto: ResearchParamsMeetingsDto, user: ProjectManager) : Promise<number> {
    try {
      return await this.meetingRepository.count({
        where: [
          researchParamsMeetingsDto.type != "" && {
            prospect: {
              stage: StageType.MEETING
            },
            pm: {
              pseudo: user.pseudo
            },
            done: researchParamsMeetingsDto.done  == "true" ? true : false,
            type: researchParamsMeetingsDto.type as MeetingType
          },
          researchParamsMeetingsDto.type == "" && {
            prospect: {
              stage: StageType.MEETING
            },
            pm: {
              pseudo: user.pseudo
            },
            done: researchParamsMeetingsDto.done  == "true" ? true : false,
          }
        ]
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer le nombre de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
    try {
      return await this.meetingRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countWeeklyForMe(user: ProjectManager) : Promise<number> {
    try {
      const today = new Date();
      const firstd = today.getDate() - today.getDay() + 1;

      //  ? getting the monday of the week
      const monday = new Date(today.setDate(firstd));

      // ? getting the sunday of the week
      const sunday = lastDayOfWeek(new Date(), { weekStartsOn: 1})

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(1,0,0,0)
      sunday.setHours(24,59,59,999)

      return await this.meetingRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          creationDate: Between(monday, sunday)
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les appels de la derniere semaine",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAll(interval: { dateDown: Date, dateUp: Date }) {
    try {
      let results : [{}] = [{}];
      results.pop();
      await this.pmRepository.find({
        relations: ["meetings"],
        where: {
          statsEnabled: true
        }
      }).then(pms => {
        pms.forEach(pm => {
          let count = 0;
          pm.meetings.length > 0 && pm.meetings.forEach(meeting => {
            if(new Date(interval.dateDown) < new Date(meeting.creationDate) && new Date(meeting.creationDate) < new Date(interval.dateUp)){
              count += 1;
            }
            
          })
          results.push({
            pseudo: pm.pseudo,
            count: count
          });
        })
      });
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForEveryOne() {
    try {
      let results: {
        labels: [string],
        datasets: [{
          label: string,
          data: [number]
        }
      ]
      } = {
        labels: [""],
        datasets: [{
          label: "",
          data: [0]
        }
      ]
      }
      results.labels.pop();
      results.datasets.pop();
     
      // getting all the pms
      let pms = await this.pmRepository.find({
        where: {
          statsEnabled: true
        }
      });
      let first = true;
      let counter = 0;

      // for each pm
      for(let pm of pms) {
        results.datasets.push({label: pm.pseudo, data: [0]})
        results.datasets[counter].data.pop();

        // ! The starting date for the stats
        let date = new Date("2022-11-07T00:00:00.000Z");
        
        while(date < new Date()) {
          // Scrolling through the dates, periods of each week 
          const startDate = date;
          const endDate = new Date(date)
          endDate.setDate(date.getDate() + 7)
          first && results.labels.push(startDate.toLocaleDateString("fr-FR"))
          await this.meetingRepository.count({
            where: {
              pm: {
                pseudo: pm.pseudo,
              },
              creationDate: Between(startDate, endDate)
            }
          }).then(count => {
            results.datasets[counter].data.push(count)
          })
          date.setDate(date.getDate() + 7)
        }
        first = false;
        counter +=1;
      }
      return results
    } catch (error) {
      console.log(error)
     throw new HttpException("Impossible de compter tous les rendez-vous pour tout le monde", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllByWeeksForMe(user: ProjectManager) {
    try {
      let results: { intervals: [{dateDown: Date, dateUp: Date}], data: [number]} = {intervals: [{dateDown: new Date, dateUp: new Date}], data: [0]};
      results.data.pop();
      results.intervals.pop();

      //  ! begining of history
      let s = new Date("2022-11-07")
      let temp = new Date("2022-11-07")

      // ! end of history
      let ed = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1 + 6));
      while(s <= ed) {
        
        // ! each week sunday
        temp.setDate(temp.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(s),
          dateUp: new Date(temp.setHours(0,59,59,999))
        });
        const count = await this.meetingRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            creationDate: Between(s, new Date(temp.setHours(0,59,59,999)))
          }
        })
        results.data.push(count)
        s.setDate(s.getDate() + 7)
      }
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels par semaines", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDto) : Promise<UpdateResult> {
    try {
      return await this.meetingRepository.update(id, updateMeetingDto);
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de mettre à jour le rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
