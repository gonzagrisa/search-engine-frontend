import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { IService } from 'src/app/api/models/i-service';
import { ServicesResourceService } from 'src/app/api/resources/services-resource.service';
import { WebsiteResourceService } from 'src/app/api/resources/website-resource.service';

@Injectable({
    providedIn: 'root'
})
export class UrlValidator {
    constructor(private apiWebsite: WebsiteResourceService,
        private apiService: ServicesResourceService) { }

    unique(field?: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            let id = control.parent.get(field).value;
            return timer(500).pipe(switchMap(() => {
                return this.apiWebsite.checkDomain({ websiteId: id, url: control.value.trim() })
                    .pipe(debounceTime(1000))
                    .pipe(
                        map(() => {
                            return null;
                        }),
                        catchError(() => {
                            return of({ registeredDomain: true });
                        })
                    );
            }));
        };
    }

    checkPing(field?: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            let protocol = control.parent.get(field).value;
            return timer(500).pipe(switchMap(() => {
                return this.apiService.testPing({ protocol: protocol, URLPing: control.value.trim() })
                    .pipe(debounceTime(1000))
                    .pipe(
                        map(() => {
                            return null;
                        }),
                        catchError(() => {
                            return of({ pingFailed: true });
                        })
                    );
            }));
        };
    }

    pingURL(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            return timer(500).pipe(switchMap(() => {
                return this.apiWebsite.pingUrl(null, {url: control.value} , null)
                    .pipe(debounceTime(1000))
                    .pipe(
                        map(() => {
                            return null;
                        }),
                        catchError(() => {
                            return of({ pingURLFailed: true });
                        })
                    );
            }));
        };
    }


    /*  checkPing(control: AbstractControl): Observable<{ [key: string]: any }> {
         console.log(control.value)
         if (!control.value) {
             return of(null);
         } else {
             return this.apiService.testPing({URLPing: control.value, protocol: 'REST'})
                 .pipe(debounceTime(1000))
                 .pipe(
                     map(() => {
                         return null;
                     }),
                     catchError(() => {
                         return of({ usernameTaken: true })
                     })
                 )
         }
     } */
}

