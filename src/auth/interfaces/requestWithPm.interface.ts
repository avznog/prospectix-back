import { Request } from 'express';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

interface RequestWithPm extends Request {
  pm: ProjectManager;
}

export default RequestWithPm;