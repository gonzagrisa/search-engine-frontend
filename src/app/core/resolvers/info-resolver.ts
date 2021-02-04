import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/api/models/i-user';
import { UserResourceService } from 'src/app/api/resources/user-resource.service';

@Injectable({
    providedIn: 'root'
})
export class InfoResolver implements Resolve<IUser>{

    constructor(private userService: UserResourceService) {}

    resolve(): IUser | Observable<IUser> | Promise<IUser> {
        return this.userService.getInfo();
    }

}
