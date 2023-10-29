import { Component, OnInit } from '@angular/core';
import { ArticleListConfig, RoadMap } from '../core';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Article, ArticlesService, PopularPostService, TagsService, UserService,RoadMapService } from '../core';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css']
})
export class RoadMapComponent implements OnInit {

  constructor(
    private roadmapService: RoadMapService,
    private cd: ChangeDetectorRef,
  ) { }
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  roadmap: RoadMap;
  ngOnInit(): void {
    this.roadmapService.getRoadMap()
      .subscribe((data: RoadMap) => {
        this.roadmap = data;
        this.cd.markForCheck();
      });
  }

}
