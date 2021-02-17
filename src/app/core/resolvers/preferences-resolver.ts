import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IPreferences } from "src/app/api/models/i-preferences";
import { PreferencesResourceService } from "src/app/api/resources/preferences-resource.service";

@Injectable({
    providedIn: 'root'
})
export class PreferencesResolver implements Resolve<IPreferences> {
    constructor(private api: PreferencesResourceService) { }

    resolve(): IPreferences | Observable<IPreferences> | Promise<IPreferences> {
        return this.api.getPreferences();
    }
}
