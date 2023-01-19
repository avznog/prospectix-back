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
          context.switchToHttp().getRequest().headers && Sentry.setContext("Request headers", context.switchToHttp().getRequest().headers)
          Sentry.captureException(exception);
        })
      )
  }
}
