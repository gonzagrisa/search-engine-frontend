import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IStats } from "src/app/api/models/i-stats";
import { StatsResourceService } from "src/app/api/resources/stats-resource.service";

@Injectable({
    providedIn: 'root'
})
export class StatsResolver implements Resolve<IStats> {
    constructor(private api: StatsResourceService) { }

    resolve(): IStats | Observable<IStats> | Promise<IStats> {
        return this.api.getQuantities();
    }
}
