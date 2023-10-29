import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { User, UserService } from '../../core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  inputValue: string;
  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        this.cd.markForCheck();
      }
    );
  }

  onEnterKey(event: any) {
    // Xử lý khi người dùng nhấn Enter
    this.router.navigate(['/search/', event.target.value]);

    // Thực hiện các hành động khác tại đây
  }
}
