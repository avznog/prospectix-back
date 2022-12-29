import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ProjectManager } from "src/entities/project-managers/project-manager.entity";

export const CurrentUser = createParamDecorator(async (data: null, context: ExecutionContext) => 
  context.switchToHttp().getRequest().user as ProjectManager
);