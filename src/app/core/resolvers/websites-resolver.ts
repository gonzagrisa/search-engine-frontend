import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { IWebsite } from "src/app/api/models/i-website";
import { WebsiteResourceService } from "src/app/api/resources/website-resource.service";

@Injectable({
    providedIn: "root"
})
export class WebsitesResolver implements Resolve<IWebsite[]>{

    constructor (private api: WebsiteResourceService) { }

    resolve(): IWebsite[] | Observable<IWebsite[]> | Promise<IWebsite[]> {
        return this.api.getWebsites();
    }
}
