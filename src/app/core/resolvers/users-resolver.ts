import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IUser } from "src/app/api/models/i-user";
import { UserResourceService } from "src/app/api/resources/user-resource.service";


@Injectable({
    providedIn: 'root'
})
export class UsersResolver implements Resolve<IUser[]>{
    
    constructor(private api: UserResourceService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IUser[] | Observable<IUser[]> | Promise<IUser[]> {
        return this.api.getUsers();
    }
}
