import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private loader: LoaderService, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.getToken()) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${this.authService.getToken()}`)
      });
    }
    return next.handle(request).pipe(finalize(() => this.loader.complete()));
  }
}

