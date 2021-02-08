import { Injectable } from '@angular/core';
import { IResourceMethodObservable, IResourceMethodObservableStrict, Resource, ResourceAction, ResourceParams, ResourceRequestBodyType, ResourceRequestMethod, ResourceResponseBodyType } from '@ngx-resource/core';
import { environment } from 'src/environments/environment';
import { IService } from '../models/i-service';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/services`
})
export class ServicesResourceService extends Resource {

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    responseBodyType: ResourceResponseBodyType.Json
  })
  getServices: IResourceMethodObservable<void, IService[]>;

  @ResourceAction({
    method: ResourceRequestMethod.Post,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text
  })
  addService: IResourceMethodObservable<IService, string>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text,
    path: '/{!id}'
  })
  updateService: IResourceMethodObservableStrict<IService, void, {id: number}, string>;

  @ResourceAction({
    method: ResourceRequestMethod.Delete,
    responseBodyType: ResourceResponseBodyType.Text,
    path: '/{!id}'
  })
  deleteService: IResourceMethodObservable<{id: number}, string>;

  @ResourceAction({
    method: ResourceRequestMethod.Post,
    requestBodyType: ResourceRequestBodyType.JSON,
    path: '/test',
    headers: { skip: 'true' }
  })
  testPing: IResourceMethodObservable<IService, void>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text,
    path: '/{!id}/reindex'
  })
  reindex: IResourceMethodObservable<{id: number}, string>;

}
