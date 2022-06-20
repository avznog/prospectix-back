import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ProjectManagerDto } from './dto/project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';
import * as bcrypt from 'bcrypt';
import TokenPayload from 'src/auth/interfaces/tokenPayload.interface';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';

@Injectable()
export class ProjectManagersService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,
  ) {}

  async create(
    createProjectManagerDto: CreateProjectManagerDto,
  ): Promise<ProjectManager> {
    return await this.pmRepository.save(createProjectManagerDto);
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
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: username,
      },
    });
    return await this.pmRepository.update(pm.id, {
      pseudo: username,
    });
  }

  async findByPayload(payload: TokenPayload): Promise<ProjectManager> {
    return await this.pmRepository.findOne({
      where: {
        pseudo: payload.username,
      },
    });
  }
}
