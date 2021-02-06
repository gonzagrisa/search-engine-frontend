import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { WebsiteResourceService } from 'src/app/api/resources/website-resource.service';

@Injectable({
    providedIn: 'root'
})
export class UrlValidator {
    constructor (private api: WebsiteResourceService) { }

    unique(field?: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            let id = control.parent.get(field).value;
            return timer(500).pipe(switchMap(() => {
                return this.api.checkDomain({ websiteId: id, url: control.value.trim() })
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
}
