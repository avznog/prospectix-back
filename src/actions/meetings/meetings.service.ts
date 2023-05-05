import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import moment from 'moment';
import { CreateMeetingDto } from 'src/actions/meetings/dto/create-meeting.dto';
import { Meeting } from 'src/actions/meetings/entities/meeting.entity';
import { GoogleService } from 'src/apis/google/google.service';
import { StageType } from 'src/constants/stage.type';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Between, DeleteResult, ILike, In, Repository, UpdateResult } from 'typeorm';
import { ResearchParamsMeetingsDto } from './dto/research-params-meetings.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    private readonly googleService: GoogleService,
    private readonly secondaryActivitiesService: SecondaryActivitiesService,
    private readonly primaryActivitiesService: PrimaryActivityService
  ){}

  async create(createMeetingDto: CreateMeetingDto, user: ProjectManager) : Promise<Meeting> {
    try {
      createMeetingDto.creationDate = moment(createMeetingDto.creationDate).tz('Europe/Paris').toDate();
      createMeetingDto.date = moment(createMeetingDto.date).tz('Europe/Paris').toDate();
      createMeetingDto.pm = await this.googleService.updateTokens(user);
      this.secondaryActivitiesService.adjustWeight(createMeetingDto.prospect.secondaryActivity.id, 1)
      this.primaryActivitiesService.adjustWeight(createMeetingDto.prospect.secondaryActivity.primaryActivity.id, 1)
      this.googleService.createEventOnCalendar(createMeetingDto, user);
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

  async findAllPaginated(researchParamsMeetingsDto: ResearchParamsMeetingsDto, user: ProjectManager) : Promise<{meetings: Meeting[], count: number}>{
    try {
      const done = researchParamsMeetingsDto.done == 1 ? true : false;
      const meetings = await this.meetingRepository.findAndCount({
        relations: ["pm", "prospect", "prospect.secondaryActivity", "prospect.secondaryActivity.primaryActivity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email", "prospect.meetings","prospect.bookmarks"],
        where: 
        // ? all parameters
        researchParamsMeetingsDto.keyword && researchParamsMeetingsDto.type && [
          {
            done: done,
            type: researchParamsMeetingsDto.type,
            prospect: {
              stage: !done ? StageType.MEETING : In([StageType.ARCHIVED, StageType.BOOKMARK, StageType.MAIL, StageType.MAIL_SENT, StageType.MEETING, StageType.MEETING_DONE_AND_OUT, StageType.PRO, StageType.REMINDER, StageType.RESEARCH]),
              companyName: ILike(`%${researchParamsMeetingsDto.keyword}%`)
            },
            pm: {
              pseudo: user.pseudo
            },
          },
          {
            done: done,
            type: researchParamsMeetingsDto.type,
            prospect: {
              stage: !done ? StageType.MEETING : In([StageType.ARCHIVED, StageType.BOOKMARK, StageType.MAIL, StageType.MAIL_SENT, StageType.MEETING, StageType.MEETING_DONE_AND_OUT, StageType.PRO, StageType.REMINDER, StageType.RESEARCH]),
              phone: {
                number: ILike(`${researchParamsMeetingsDto.keyword}`)
              }
            },
            pm: {
              pseudo: user.pseudo
            },
          }
        ] || 
        // ? Only KEYWORD
        researchParamsMeetingsDto.keyword && !researchParamsMeetingsDto.type && [
          {
            done: done,
            prospect: {
              stage: !done ? StageType.MEETING : In([StageType.ARCHIVED, StageType.BOOKMARK, StageType.MAIL, StageType.MAIL_SENT, StageType.MEETING, StageType.MEETING_DONE_AND_OUT, StageType.PRO, StageType.REMINDER, StageType.RESEARCH]),
              companyName: ILike(`%${researchParamsMeetingsDto.keyword}%`)
            },
            pm: {
              pseudo: user.pseudo
            },
          },
          {
            done: done,
            prospect: {
              stage: !done ? StageType.MEETING : In([StageType.ARCHIVED, StageType.BOOKMARK, StageType.MAIL, StageType.MAIL_SENT, StageType.MEETING, StageType.MEETING_DONE_AND_OUT, StageType.PRO, StageType.REMINDER, StageType.RESEARCH]),
              phone: {
                number: ILike(`${researchParamsMeetingsDto.keyword}`)
              }
            },
            pm: {
              pseudo: user.pseudo
            },
          }
        ] || 
        // ? only TYPE
        researchParamsMeetingsDto.type && !researchParamsMeetingsDto.keyword && [
          {
            done: done,
            type: researchParamsMeetingsDto.type,
            prospect: {
              stage: !done ? StageType.MEETING : In([StageType.ARCHIVED, StageType.BOOKMARK, StageType.MAIL, StageType.MAIL_SENT, StageType.MEETING, StageType.MEETING_DONE_AND_OUT, StageType.PRO, StageType.REMINDER, StageType.RESEARCH]),
            },
            pm: {
              pseudo: user.pseudo
            },
          },
        ] || 
        // ? NO PARAMETERS
        [
          {
            done: done,
            prospect: {
              stage: !done ? StageType.MEETING : In([StageType.ARCHIVED, StageType.BOOKMARK, StageType.MAIL, StageType.MAIL_SENT, StageType.MEETING, StageType.MEETING_DONE_AND_OUT, StageType.PRO, StageType.REMINDER, StageType.RESEARCH]),
            },
            pm: {
              pseudo: user.pseudo
            },
          },

        ],
        order: {
          date: "ASC"
        },
        take: researchParamsMeetingsDto.take,
        skip: researchParamsMeetingsDto.skip
      });

      return {
        meetings: meetings[0],
        count: meetings[1]
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
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
      // const monday = new Date(today.setDate(firstd));

      const date = new Date(today);
      const day = date.getDay(); // 👉️ get day of week

      // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);

      const monday =  new Date(date.setDate(diff));

      // ? getting the sunday of the week
      // const sunday = new Date(today.setDate(firstd + 6));
      const sunday = lastDayOfWeek(new Date(), { weekStartsOn: 1});

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(0,0,0,0)
      sunday.setHours(23,59,59,999)
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
      if(updateMeetingDto.date) {
        updateMeetingDto.date = moment(updateMeetingDto.date).tz('Europe/Paris').toDate();
      }
      return await this.meetingRepository.update(id, updateMeetingDto);
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de mettre à jour le rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  async countWeeklyAll() : Promise<{id: number, count: number}[]> {
    try {
      const today = new Date();
      const firstd = today.getDate() - today.getDay() + 1;

      //  ? getting the monday of the week
      // const monday = new Date(today.setDate(firstd));

      const date = new Date(today);
      const day = date.getDay(); // 👉️ get day of week

      // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);

      const monday =  new Date(date.setDate(diff));

      // ? getting the sunday of the week
      // const sunday = new Date(today.setDate(firstd + 6));
      const sunday = lastDayOfWeek(new Date(), { weekStartsOn: 1});

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(0,0,0,0)
      sunday.setHours(23,59,59,999)
      const results = [{}] as {id: number, count: number}[];
      const pms = await this.pmRepository.find({
        relations: ["meetings"],
        where: {
          objectived: true
        }
      });

      results.pop()
      pms.forEach(pm => {
        results.push({
          id: pm.id,
          count: !pm.meetings ? 0 : pm.meetings.filter(meeting => monday <= meeting.creationDate && meeting.creationDate <= sunday).length
        })
      })
      
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer le nombre de rendez)ous de la semaine de tous les cdp", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async countMeetingsForWeekAllPm(interval: { dateDown: Date, dateUp: Date}) : Promise<{id: number, count: number}[]> {
    try {
      const results : {id: number, count: number}[] = [];
      const pms = await this.pmRepository.find({
        relations: ["meetings"],
        where: {
          objectived: true
        }
      });
      await pms.forEach(async (pm: ProjectManager) => {
        results.push({id: pm.id, count: pm.meetings.filter(meeting => new Date(interval.dateDown) <= meeting.creationDate && meeting.creationDate <= new Date(interval.dateUp)).length ?? 0})
      })
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Error whilst getting all meetings for one week for all pm", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
