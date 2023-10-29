import { Component, Input, OnInit } from '@angular/core';
import { Article, PopularPostService, TagsService } from '../../core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})


export class SidebarComponent implements OnInit {
  @Input() mucluc: string [];
  tags1: Array<string> = [];
  tags2: Array<string> = [];
  count : string;
  popularPost : Article[];
  popularPostNew : Article;
  constructor(
    private popularPostService: PopularPostService,
    private tagsService: TagsService,
  ) { }

  ngOnInit(): void {
    //load Article to locl
   this.popularPost= this.popularPostService.getPopularPosts();
   if (this.popularPost && this.popularPost.length) {
    this.popularPostNew= this.popularPost[0];

   }
    this.tagsService.getAll()
    .subscribe(tags => {
      this.tags1 = tags.slice(0, 4); // Lấy 5 phần tử đầu tiên
      this.tags2 = tags.slice(4); // Lấy những phần tử còn lại
      this.count = this.tags2.length.toString(); // Số phần tử của tag2
    });
  }

}
