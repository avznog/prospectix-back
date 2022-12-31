import { Injectable, Res } from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';

@Injectable()
export class SentryService {
  constructor() {}

  setSentryUser(pm: ProjectManager) {
    Sentry.setContext("User", {
      pseudo: pm.pseudo,
      name: pm.name,
      firstname: pm.firstname,
      admin: pm.admin,
      disabled: pm.disabled
    })
  }
}
