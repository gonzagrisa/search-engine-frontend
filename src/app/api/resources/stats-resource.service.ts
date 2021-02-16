import { Injectable } from '@angular/core';
import { IResourceMethodObservable, Resource, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

@ResourceParams({
  path: `${environment.apiUrl}/stats`
})
export class StatsResourceService extends  Resource{

  @ResourceAction({
    method: ResourceRequestMethod.Get
  })
  getQueries: IResourceMethodObservable<void,void>;

  @ResourceAction({
    method: ResourceRequestMethod.Get
  })
  getQueriesByDay: IResourceMethodObservable<void,void>;

  @ResourceAction({
    method: ResourceRequestMethod.Get
  })
  getWords: IResourceMethodObservable<void,void>;

  @ResourceAction({
    method: ResourceRequestMethod.Get
  })
  getQuantities: IResourceMethodObservable<void,void>;
  
}
