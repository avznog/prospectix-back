import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { Call } from 'src/actions/calls/entities/call.entity';
import { CreateCallDto } from 'src/actions/calls/dto/create-call.dto';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Between, Repository } from 'typeorm';
import moment from 'moment';

@Injectable()
export class CallsService {

  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ) {}

  async createForMe(createCallDto: CreateCallDto, user: ProjectManager) : Promise<Call> {
    try {
      createCallDto.date = moment(createCallDto.date).tz('Europe/Paris').toDate();
      createCallDto.pm = user;
      return await this.callRepository.save(this.callRepository.create(createCallDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createCallDto: CreateCallDto) {
    try {
      createCallDto.date = moment(createCallDto.date).tz('Europe/Paris').toDate();
      return await this.callRepository.save(this.callRepository.create(createCallDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
    try {
      return await this.callRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver les appels", HttpStatus.INTERNAL_SERVER_ERROR);
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
      return await this.callRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          // date: Between(new Date(first), new Date(end))
          date: Between(monday, sunday)
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les appels de la derniere semaine",HttpStatus.INTERNAL_SERVER_ERROR);
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
        const count = await this.callRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            date: Between(s, new Date(temp.setHours(0,59,59,999)))
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

  async countAll(interval: { dateDown: Date, dateUp: Date}) {
    try {
      let results: [{}] = [{}];
      results.pop();
      const pms = await this.pmRepository.find({
      relations: ["calls"],
      where: {
        statsEnabled: true
      } 
      });
      for(let pm of pms) {
        let count = 0;
        pm.calls ? pm.calls.forEach(call => {
          if(new Date(interval.dateDown) < new Date(call.date) && new Date(call.date) < new Date(interval.dateUp)){
            count += 1
          }
        }) : 0;

       results.push({
        pseudo: pm.pseudo,
        count: count
       }) 
      }
      return results;
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels",HttpStatus.INTERNAL_SERVER_ERROR);
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
          await this.callRepository.count({
            where: {
              pm: {
                pseudo: pm.pseudo,
              },
              date: Between(startDate, endDate)
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
     throw new HttpException("Impossible de compter tous les appels pour tout le monde", HttpStatus.INTERNAL_SERVER_ERROR);
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
        relations: ["calls"],
        where: {
          objectived: true
        }
      });

      results.pop()
      pms.forEach(pm => {
        results.push({
          id: pm.id,
          count: !pm.calls ? 0 : pm.calls.filter(call => monday <= call.date && call.date <= sunday).length ?? 0
        })
      })
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer le nombre d'appels de la semaine de tous les cdp", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async countCallsForWeekAllPm(interval: { dateDown: Date, dateUp: Date}) : Promise<{id: number, count: number}[]> {
    try {
      const results : {id: number, count: number}[] = [];
      const pms = await this.pmRepository.find({
        relations: ["calls"],
        where: {
          objectived: true
        }
      });
      await pms.forEach(async (pm: ProjectManager) => {
        results.push({id: pm.id, count: pm.calls.filter(call => new Date(interval.dateDown) <= call.date && call.date <= new Date(interval.dateUp)).length ?? 0})
      })
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Error whilst getting all calls for one week for all pm", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
