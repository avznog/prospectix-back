import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, Repository } from 'typeorm';
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
      const today = new Date();
      const firstd = today.getDate() - today.getDay() + 1;

      //  ? getting the monday of the week
      const monday = new Date(today.setDate(firstd));

      // ? getting the sunday of the week
      const sunday = new Date(today.setDate(firstd + 6));

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(1,0,0,0)
      sunday.setHours(24,59,59,999)

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

      // ! end of history
      let ed = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1 + 6));
      while(s <= ed) {
        let temp = new Date(ed);
        // ! each week sunday
        temp.setDate(s.getDate() + 7)
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
}
