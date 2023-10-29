import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Article, ArticleListConfig, RoadMap } from '../models';
import { map } from 'rxjs/operators';
import { MapData } from '../models/mapdata.model';

@Injectable({
  providedIn: 'root'
})
export class RoadMapService {
  constructor(
    private apiService: ApiService
  ) { }

  getRoadMap(): Observable<RoadMap> {
    return this.apiService.get('/roadmap').pipe(map(data => {
        const mapdata: MapData = data.mapdata;
        const groups: any[] = data.groups;
        return { mapdata, groups };
    }));
}

}
