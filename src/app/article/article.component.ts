import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  Article,
  ArticlesService,
  Comment,
  CommentsService,
  User,
  UserService,
  PopularPostService
} from '../core';
import slugify from 'slugify';

@Component({
  selector: 'app-article-page',
  templateUrl: './article.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit {
  article: Article;
  currentUser: User;
  canModify: boolean;
  comments: Comment[];
  commentControl = new FormControl();
  commentFormErrors = {};
  isSubmitting = false;
  createTime: string='';
  articleId: string;
  urlEncodedLink: string;
  headings: string[] = [];
  constructor(
    private route: ActivatedRoute,
 
    private commentsService: CommentsService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private popularPostService: PopularPostService,

  ) { }

  ngOnInit() {
    // Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: Article }) => {
        this.article = data.article;
        /// format này hiển thị 
        const createdAt = moment(this.article.createdAt); // Trường ngày tạo của bài viết
        const currentTime = moment();
        const postedTime = createdAt.subtract(2, 'hours'); // Sử dụng trường ngày tạo
        const timeDiff = currentTime.diff(postedTime, 'minutes');
        console.log(timeDiff);
        
        if (timeDiff < 60) {
          this.createTime =`Đã đăng cách đây ${timeDiff} phút`;
          console.log(`Đã đăng cách đây ${timeDiff} phút`);
        } else if (timeDiff < 1440) {
          const hoursDiff = Math.floor(timeDiff / 60);
          this.createTime =`Đã đăng cách đây ${hoursDiff} giờ`;
        } else {
          const daysDiff = Math.floor(timeDiff / 1440);
          this.createTime =`Đã đăng cách đây ${daysDiff} ngày`;
        }
        // Load the comments on this article
        this.populateComments();
        this.cd.markForCheck();
      }
    );

    // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData: User) => {
        this.currentUser = userData;

        this.canModify = (this.currentUser.username === this.article.author.username);
        this.cd.markForCheck();
      }
    );
    // load popularPosts
    this.popularPostService.savePopularPosts(this.article);

    // Lấy articleId từ URL
    this.route.params.subscribe(params => {
      this.articleId = params['id'];
    });

    // Tạo link share Facebook bằng cách lấy URL trực tiếp từ trình duyệt
    this.urlEncodedLink = encodeURIComponent(window.location.href);
    this.headings=this.article.mucluc;
  }

  onToggleFavorite(favorited: boolean) {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  trackByFn(index, item) {
    return index;
  }

  onToggleFollowing(following: boolean) {
    this.article.author.following = following;
  }



  populateComments() {
    this.commentsService.getAll(this.article.slug)
      .subscribe(comments => {
        this.comments = comments;
        this.cd.markForCheck();
      });
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = {};

    const commentBody = this.commentControl.value;
    this.commentsService
      .add(this.article.slug, commentBody)
      .subscribe(
        comment => {
          this.comments.unshift(comment);
          this.commentControl.reset('');
          this.isSubmitting = false;
          this.cd.markForCheck();
        },
        errors => {
          this.isSubmitting = false;
          this.commentFormErrors = errors;
          this.cd.markForCheck();
        }
      );
  }

  onDeleteComment(comment) {
    this.commentsService.destroy(comment.id, this.article.slug)
      .subscribe(
        success => {
          this.comments = this.comments.filter((item) => item !== comment);
          this.cd.markForCheck();
        }
      );
  }


  scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  

}
