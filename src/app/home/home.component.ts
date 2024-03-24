import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Article, ArticleListConfig, ArticlesService, PopularPostService, TagsService, UserService } from '../core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private tagsService: TagsService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private articlesService: ArticlesService,

  ) {}

  isAuthenticated: boolean;
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  // tags: Array<string> = [];
  tagsLoaded = false;
  article: Article;
  
  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

        // set the article list accordingly
        if (authenticated) {
          this.setListTo('feed');
        } else {
          this.setListTo('all');
        }
        this.cd.markForCheck();
      }
    );

    this.articlesService.getView()
    .subscribe(view => {
      this.article = view;
      this.tagsLoaded = true;
      this.cd.markForCheck();
    });
  }
  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }
  trackByFn(index, item) {
    return index;
  }

  setListTo(type: string = '', filters: Object = {}) {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === 'feed' && !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Otherwise, set the list object
    this.listConfig = {type: type, filters: filters};
  }

}
