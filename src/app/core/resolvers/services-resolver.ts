import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { IService } from "src/app/api/models/i-service";
import { ServicesResourceService } from "src/app/api/resources/services-resource.service";

@Injectable({
    providedIn: 'root'
})
export class ServicesResolver implements Resolve<IService[]> {

    constructor(private api: ServicesResourceService) { }

    resolve(): IService[] | Observable<IService[]> | Promise<IService[]> {
        return this.api.getServices();
    }
}
