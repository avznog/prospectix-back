import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Repository } from 'typeorm';
import { CreateStatsHistoryDto } from './dto/create-stats-history.dto';
import { UpdateStatsHistoryDto } from './dto/update-stats-history.dto';
import { StatsHistory } from './entities/stats-history.entity';

@Injectable()
export class StatsHistoryService {

  constructor(
    @InjectRepository(StatsHistory)
    private readonly statsHistoryRepository: Repository<StatsHistory>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ) {}

  async create(createStatsHistoryDto: CreateStatsHistoryDto, user: ProjectManager) : Promise<StatsHistory> {
    try {
      createStatsHistoryDto.pm = await this.pmRepository.findOne({
        where: {
          pseudo: user.pseudo
        }
      });
      return await this.statsHistoryRepository.save(this.statsHistoryRepository.create(createStatsHistoryDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer un élément de l'historique de statistique", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllForMe(user: ProjectManager) : Promise<StatsHistory[]> {
    try {
      return await this.statsHistoryRepository.find({
        where: {
          pm: {
            pseudo: user.pseudo
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer l'historique des statistiques", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} statsHistory`;
  }

  update(id: number, updateStatsHistoryDto: UpdateStatsHistoryDto) {
    return `This action updates a #${id} statsHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} statsHistory`;
  }
}
