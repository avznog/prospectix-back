import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { ProjectManagerDto } from './dto/project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';
import * as bcrypt from "bcrypt";
import TokenPayload from 'src/auth/interfaces/tokenPayload.interface';

@Injectable()
export class ProjectManagersService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ){}

  async create(createProjectManagerDto: CreateProjectManagerDto) : Promise<ProjectManager> {
    return await this.pmRepository.save(createProjectManagerDto)
  }
  
  async setCurrentRefreshToken(refreshToken: string, username: string) : Promise<UpdateResult> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const pmDto = new ProjectManagerDto();
    pmDto.pseudo = username;
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: pmDto.pseudo
      }
    })

    return await this.pmRepository.update(
      pm.id, {
        currentHashedRefreshToken: currentHashedRefreshToken
      }
      
    );
  }

  async findByPayload(payload: TokenPayload): Promise<ProjectManager>{
    return await this.pmRepository.findOne({
      where: {
        pseudo: payload.username
      }
    });
  }

  async getPmIfRefreshTokenMatches(refreshToken: string, username: string) : Promise<ProjectManager>{
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: username
      }
    });

    if(!pm)
      throw new HttpException("Aucun cdp n'existe avec ce nom d'utilisateur", HttpStatus.NOT_FOUND)

    const isRefreshtokenMatching = await bcrypt.compare(
      refreshToken,
      pm.currentHashedRefreshToken
    );

    if(isRefreshtokenMatching){
      return pm;
    }
  }

  async removeRefreshToken(username: string) : Promise<UpdateResult> {
    const pm = await this.pmRepository.findOne({
      where: {
        pseudo: username
      }
    });
    return await this.pmRepository.update(
      pm.id, {
        pseudo: username
      }
    )
  }

  findAll() {
    return `This action returns all projectManagers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectManager`;
  }

  update(id: number, updateProjectManagerDto: UpdateProjectManagerDto) {
    return `This action updates a #${id} projectManager`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectManager`;
  }

}
