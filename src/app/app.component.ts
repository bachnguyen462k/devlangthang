import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { UserService, TagsService } from "./core";
import { CategoryService } from './core/services/categorys.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService,
    private tagsService: TagsService,
    private categorySerice: CategoryService,
    private cd: ChangeDetectorRef) { }
  tagsLoaded = false;
  tags: Array<string> = [];
  categorys: Array<string> = [];


  isActive: boolean = false;
  isActive2: boolean = false;
  isActive3: boolean = false;
  isActive4: boolean = false;
  ngOnInit() {
    this.userService.populate();
    this.tagsService.getAll()
      .subscribe(tags => {
        this.tags = tags;
        this.tagsLoaded = true;
        this.cd.markForCheck();
      });

    this.categorySerice.getAll()
      .subscribe(categorys => {
        this.categorys = categorys;
        this.tagsLoaded = true;
        this.cd.markForCheck();
      });


  }
  toggleActiveClass(tye: number) {
    if (tye == 1) {
      this.isActive = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
    } else if(tye == 2){
      this.isActive = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.isActive4 = false;
    }else if(tye == 3){
      this.isActive = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.isActive4 = false;
    }else if(tye == 4){
      this.isActive = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = true;
    }
  }

}
