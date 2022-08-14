import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectManagerDto } from './dto/project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';
import * as bcrypt from 'bcrypt';
import TokenPayload from 'src/auth/interfaces/tokenPayload.interface';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';

@Injectable()
export class ProjectManagersService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,
  ) {}

  async create(
    createProjectManagerDto: CreateProjectManagerDto,
  ): Promise<ProjectManager> {
    try {
     createProjectManagerDto.disabled = false;
     return await this.pmRepository.save(createProjectManagerDto); 
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer le nouvel utilisateur", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    username: string,
  ): Promise<UpdateResult> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const pmDto = new ProjectManagerDto();
    pmDto.pseudo = username;
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: pmDto.pseudo,
      },
    });

    return await this.pmRepository.update(pm.id, {
      currentHashedRefreshToken: currentHashedRefreshToken,
    });
  }

  async getPmIfRefreshTokenMatches(
    refreshToken: string,
    username: string,
  ): Promise<ProjectManager> {
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: username,
      },
    });

    if (!pm)
      throw new HttpException(
        "Aucun cdp n'existe avec ce nom d'utilisateur",
        HttpStatus.NOT_FOUND,
      );

    const isRefreshtokenMatching = await bcrypt.compare(
      refreshToken,
      pm.currentHashedRefreshToken,
    );

    if (isRefreshtokenMatching) {
      return pm;
    }
  }

  async removeRefreshToken(username: string): Promise<UpdateResult> {
    try {
      const pm = await this.pmRepository.findOne({
        where: {
          pseudo: username,
        },
      });
      return await this.pmRepository.update(pm.id, {
        pseudo: username,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossble de supprimer le refresh token", HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload: TokenPayload): Promise<ProjectManager> {
    try {
      return await this.pmRepository.findOne({
        where: {
          pseudo: payload.username,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de récupérer l'utilisateur par payload",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() : Promise<ProjectManager[]> {
    try {
      return await this.pmRepository.find({
        relations: ["goals","meetings","reminders","sentEmails","bookmarks","events","bookmarks.prospect"]
      }); 
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de récupérer les project managers", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateProjectManagerDto: UpdateProjectManagerDto) : Promise<UpdateResult> {
    try {
      return await this.pmRepository.update(id, updateProjectManagerDto);
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de modifier le chef de projet", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async disable(id: number) : Promise<UpdateResult> {
    try {
      return await this.pmRepository.update(id, {disabled: true});
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de désactiver l'utilisateur", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async enable(id: number) : Promise<UpdateResult> {
    try {
      return await this.pmRepository.update(id, { disabled: false });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'activer l'utilisateur", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginated(take: number, skip: number) : Promise<ProjectManager[]> {
    try {
      return await this.pmRepository.find({
        relations: ["goals","meetings","reminders","sentEmails","bookmarks","events","bookmarks.prospect"],
        take: take,
        skip: skip,
        order: {
          id: "asc"
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de réupérer les project managers demandés", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
