import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateCallDto } from './dto/create-call.dto';
import { Call } from './entities/call.entity';

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
      createCallDto.pm = user;
      return await this.callRepository.save(this.callRepository.create(createCallDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createCallDto: CreateCallDto) {
    try {
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
      let end = lastDayOfWeek(new Date(), { weekStartsOn: 2});
      let first = new Date();
      first.setDate(end.getDate() - 7)
      return await this.callRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          date: Between(new Date(first), new Date(end))
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

      // ! Date de début de l'historique
      let startDate = new Date("2022-11-07T00:00:00.000Z");

      //! Date de fin de l'historique
      let endDate = lastDayOfWeek(new Date(), {weekStartsOn: 2});

      // ! Date de début pour incrémenter
      let d = new Date("2022-11-07T00:00:00.000Z");
      while(startDate  < endDate) {
        d.setDate(startDate.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(startDate),
          dateUp: new Date(d)
        });
        const count =  await this.callRepository.count({
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
      const monday = new Date(today.setDate(firstd));

      // ? getting the sunday of the week
      const sunday = new Date(today.setDate(firstd + 6));

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(1,0,0,0)
      sunday.setHours(24,59,59,999)

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
}
