import { Injectable } from '@angular/core';
import { IResourceMethodObservable, IResourceMethodObservableStrict, Resource, ResourceAction, ResourceParams, ResourceRequestBodyType, ResourceRequestMethod, ResourceResponseBodyType } from '@ngx-resource/core';
import { environment } from 'src/environments/environment';
import { IMetadata } from '../models/i-metadata';

@Injectable({
  providedIn: 'root'
})

@ResourceParams({
  pathPrefix: `${environment.apiUrl}/metadata`
})
export class MetadataResourceService extends Resource {

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    responseBodyType: ResourceResponseBodyType.Json
  })
  getMetadata: IResourceMethodObservable<void, IMetadata[]>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text
  })
  updateMetadata: IResourceMethodObservable<IMetadata, string>;

  @ResourceAction({
    method: ResourceRequestMethod.Delete,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text,
    path: '/{!id}'
  })
  deleteMetadata: IResourceMethodObservable<{id: string}, string>;

  @ResourceAction({
    method: ResourceRequestMethod.Put,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text,
    path: '/selected'
  })
  updateBatch: IResourceMethodObservable<IMetadata[], string>;

  @ResourceAction({
    method: ResourceRequestMethod.Delete,
    requestBodyType: ResourceRequestBodyType.JSON,
    responseBodyType: ResourceResponseBodyType.Text,
    path: '/selected'
  })
  deleteBatch: IResourceMethodObservable<IMetadata[], string>;

}
