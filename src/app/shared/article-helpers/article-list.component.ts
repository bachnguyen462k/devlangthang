import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Article, ArticleListConfig, ArticlesService } from '../../core';
@Component({
  selector: 'app-article-list',
  styleUrls: ['article-list.component.css'],
  templateUrl: './article-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent {
  inputValue: string='';
  constructor (
    private articlesService: ArticlesService,
    private cd: ChangeDetectorRef,
    
  ) {}
  @Input() limit: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery(this.inputValue);
    }
  }
  @Input() title: string;
  @Input() totall: number;
  query: ArticleListConfig;
  results: Article[];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];
  maxDisplayedPages = 5; // giới hạn số trang hiển thị
  displayedPages: number[] = []; // các trang hiển thị
  updateDisplayedPages() {
    const halfMax = Math.floor(this.maxDisplayedPages / 2);
    const startIndex = Math.max(0, this.currentPage - halfMax);
    const endIndex = Math.min(this.totalPages.length - 1, startIndex + this.maxDisplayedPages - 1);
    this.displayedPages = this.totalPages.slice(startIndex, endIndex + 1);
  }


  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery(this.inputValue);
    this.updateDisplayedPages();
  }

  trackByFn(index, item) {
    return index;
  }

  runQuery(inputValue :string) {
    this.loading = true;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1));
      this.query.filters.search=this.inputValue;
    }

    this.articlesService.query(this.query)
    .subscribe(data => {
      this.loading = false;
      this.results = data.articles;

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      this.totalPages = Array.from(new Array(Math.ceil(data.articlesCount / this.limit)), (val, index) => index + 1);
      this.cd.markForCheck();
      this.updateDisplayedPages();
    });
    // window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  loadMore() {
    this.currentPage++;
    this.runQuery(this.inputValue);
  }
  
  get showLoadMoreButton() {
    return this.currentPage < this.totalPages.length;
  }
  
  onEnterKey(event: any) {
    this.runQuery(this.inputValue);
  }
}
