import { Injectable, Query } from '@angular/core';
import { IResourceMethodObservable, IResourceMethodObservableStrict, Resource, ResourceAction, ResourceParams, ResourceRequestBodyType, ResourceRequestMethod, ResourceResponseBodyType } from '@ngx-resource/core';
import { environment } from 'src/environments/environment';
import { IWebsite } from '../models/i-website';

@Injectable({
  providedIn: 'root'
})

@ResourceParams({
  pathPrefix: `${environment.apiUrl}/websites`
})
export class WebsiteResourceService extends Resource{
  
  @ResourceAction({
    method: ResourceRequestMethod.Get,
    responseBodyType: ResourceResponseBodyType.Json
  })
  getWebsites: IResourceMethodObservable<void, IWebsite[]>;

  @ResourceAction({
    method: ResourceRequestMethod.Post,
    requestBodyType: ResourceRequestBodyType.JSON
  })
  addWebsite: IResourceMethodObservable<IWebsite, void>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    requestBodyType: ResourceRequestBodyType.JSON
  })
  updateWebsite: IResourceMethodObservable<IWebsite, void>;
  
  @ResourceAction({
    method: ResourceRequestMethod.Delete,
    requestBodyType: ResourceRequestBodyType.JSON
  })
  deleteWebsite: IResourceMethodObservable<IWebsite, void>;

  @ResourceAction({
    method: ResourceRequestMethod.Post,
    path: '/check-domain',
    requestBodyType: ResourceRequestBodyType.JSON,
    headers: { skip: 'true' }
  })
  checkDomain: IResourceMethodObservable<IWebsite, void>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    path: '/{!id}/reindex',
  })
  reindex: IResourceMethodObservableStrict<void, void, {id: number}, void>;

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    path: '/check',
    headers: { skip: 'true' }
  })
  pingUrl: IResourceMethodObservableStrict<void, {url: string} , void, void>;

}
