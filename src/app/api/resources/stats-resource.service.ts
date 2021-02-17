import { Injectable } from '@angular/core';
import { IResourceMethodObservable, Resource, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { environment } from 'src/environments/environment';
import { IStats } from 'src/app/api/models/i-stats';

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
    method: ResourceRequestMethod.Get,
    path: `${environment.apiUrl}/stats/quantities`
  })
  getQuantities: IResourceMethodObservable<void, IStats>;
}
