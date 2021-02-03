import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormGroup } from "@angular/forms";
import { Observable, of, timer } from "rxjs";
import { catchError, debounceTime, map, switchMap } from "rxjs/operators";
import { UserResourceService } from "src/app/api/resources/user-resource.service";

@Injectable({
    providedIn: 'root'
})
export class UserValidators {
    constructor(private api: UserResourceService) { }

    username(field?: string, userId?: number): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            let id: number;
            if (field)
                id = control.parent.get(field).value;
            else
                id = userId;
            return timer(500).pipe(switchMap(() => {
                return this.api.checkUsername({user_id: id, username: control.value })
                    .pipe(debounceTime(1000))
                    .pipe(
                        map(() => {
                            return null;
                        }),
                        catchError(() => {
                            return of({ usernameTaken: true })
                        })
                    )
            }))
        }
    }

    password(field?: string, userId?: number): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            let id: number;
            if (field)
                id = control.parent.get(field).value;
            else
                id = userId;
            return timer(500).pipe(switchMap(() => {
                return this.api.checkPassword({user_id: id, password: control.value})
                    .pipe(debounceTime(1000))
                    .pipe(
                        map(() => {
                            return null;
                        }),
                        catchError(() => {
                            return of({ notOgPassword: true })
                        })
                    )
            }))
        }
    }
    
    /* Custom Validator (not a function validator)
    username(control: AbstractControl, userId: number): Observable<{ [key: string]: any }> {
        if (!control.value) {
            return of(null);
        } else {
            return timer(500).pipe(switchMap(() => {
                return this.api.checkUsername({ username: control.value })
                    .pipe(debounceTime(1000))
                    .pipe(
                        map(() => {
                            return null;
                        }),
                        catchError(() => {
                            return of({ usernameTaken: true })
                        })
                    )
            }))
        }
    } */
}
