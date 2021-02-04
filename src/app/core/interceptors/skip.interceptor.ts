import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Injectable()
export class SkipInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has('skip')) {
      request = request.clone({
        headers: request.headers.delete('skip')
      });
      return next.handle(request);
    } else {
      this.loaderService.start();
      return next.handle(request);
    }
  }
}
