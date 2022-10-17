import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { MeetingType } from 'src/constants/meeting.type';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, DeleteResult, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { ResearchParamsMeetingsDto } from './dto/research-parmas-meetings.dto';
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
      let currentDate = new Date;
      var endDate = new Date(currentDate.setDate((currentDate.getDate() - currentDate.getDay() - 6) + 6));
      return await this.meetingRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          date: MoreThan(endDate)
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
      let startDate = new Date("2022-11-07T00:00:00.000Z");
      let endDate = lastDayOfWeek(new Date(), {weekStartsOn: 2});
      let d = new Date("2022-11-07T00:00:00.000Z");
      while(startDate  < endDate) {
        d.setDate(startDate.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(startDate),
          dateUp: new Date(d)
        });
        const count =  await this.meetingRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            date: Between(new Date(startDate), new Date(d))
          }
        })
        results.data.push(count)
        startDate.setDate(startDate.getDate() + 7)
      }
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels par semaines", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
