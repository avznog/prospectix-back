import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';

@Injectable()
export class ProjectManagersService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,
  ) {}

  create(createProjectManagerDto: CreateProjectManagerDto) {
    return this.pmRepository.save(createProjectManagerDto);
  }

  async findAll(): Promise<ProjectManager[]> {
    return await this.pmRepository.find();
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

  //TODO - with auth -> returns the user
  // async findByPayload(payload: TokenPayLoad)(
  //   return this.projectManagerRepository.findOne(
  //     {
  //       where: {
  //         pseudo: payload.username
  //       }
  //     }
  //   )
  // )
  async findByPayload(): Promise<ProjectManager> {
    const pm = new ProjectManager();
    pm.pseudo = 'bgonzva';
    pm.admin = false;
    pm.id = 3;
    return await pm;
  }
}
