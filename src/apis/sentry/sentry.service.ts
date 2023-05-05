import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';

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
