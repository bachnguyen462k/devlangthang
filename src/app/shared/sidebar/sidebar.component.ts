import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Article, ArticlesService, PopularPostService, TagsService, User, UserService } from '../../core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { ArticleListConfig, Profile } from '../../core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})


export class SidebarComponent implements OnInit {
  @Input() mucluc: string[];
  @Input() comments: number;
  @Input() article: Article;
  @Output() toggle = new EventEmitter<boolean>();
  tags1: string[];
  tags2: Array<string> = [];
  count: string;
  popularPost: Article[];
  popularPostNew: Article;
  isSubmitting = false;
  canModify: boolean = false;
  currentUser: User;
  isDeleting = false;
  results: Article[];
  constructor(
    private popularPostService: PopularPostService,
    private tagsService: TagsService,
    private userService: UserService,
    private articlesService: ArticlesService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }
  articlesConfig: ArticleListConfig = {
    type: 'all',
    filters: {
      limit:3
    },
  
  };
  ngOnInit(): void {

    //load Article to locl
    this.popularPost = this.popularPostService.getPopularPosts();
    if (this.popularPost && this.popularPost.length) {
      this.popularPostNew = this.popularPost[0];

    }
    // this.tagsService.getAll()
    // .subscribe(tags => {
    //   this.tags1 = tags.slice(0, 4); // Lấy 5 phần tử đầu tiên
    //   this.tags2 = tags.slice(4); // Lấy những phần tử còn lại
    //   this.count = this.tags2.length.toString(); // Số phần tử của tag2
    // });

    // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData: User) => {
        this.currentUser = userData;
        this.canModify = (this.currentUser.username === this.article.author.username);
        this.cd.markForCheck();
      }
    );

    this.articlesConfig.filters.author = this.article.author.username;
    this.cd.markForCheck();
    this.results = [];
    this.articlesService.query(this.articlesConfig)
    .subscribe(data => {
      this.results = data.articles;
      this.cd.markForCheck();

    });
    console.log(this.results)
  }

  onToggleFavorite(favorited: boolean) {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }


  onToggleFollowing(following: boolean) {
    this.article.author.following = following;
  }

  deleteArticle() {
    this.isDeleting = true;

    this.articlesService.destroy(this.article.slug)
      .subscribe(
        success => {
          this.router.navigateByUrl('/');
        }
      );
  }
}
