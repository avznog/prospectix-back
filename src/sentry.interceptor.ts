import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { Observable, tap } from 'rxjs';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap(null, async (exception) => {
          console.log("flenflkznflnelzkfzefz")
          const response = context.switchToHttp().getResponse().headers
          console.log(response)
          console.log(exception)
          Sentry.setContext("User", {
            name: "myusername",
            version: "versio de prod"
          })
          Sentry.captureException(exception);
        })
      )
  }
}
