import { Injectable } from '@angular/core';
import { IResourceMethodObservable, Resource, ResourceAction, ResourceParams, ResourceRequestBodyType, ResourceRequestMethod, ResourceResponseBodyType } from '@ngx-resource/core';
import { environment } from 'src/environments/environment';
import { IPreferences } from '../models/i-preferences';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/preferences`
})
export class PreferencesResourceService extends Resource{

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    responseBodyType: ResourceResponseBodyType.Blob,
    path: '/file'
  })
  getFile: IResourceMethodObservable<void, Blob>;
  
  @ResourceAction({
    method: ResourceRequestMethod.Get,
    responseBodyType: ResourceResponseBodyType.Json
  })
  getPreferences: IResourceMethodObservable<void, IPreferences>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    requestBodyType: ResourceRequestBodyType.JSON
  })
  updatePreferences: IResourceMethodObservable<IPreferences, void>;

}
