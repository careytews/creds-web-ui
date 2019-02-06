import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavBarMenuItem } from './nav-bar/nav-bar.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Trust Networks';
  themeClass = 'theme-dark';

  navBarMenuItems: NavBarMenuItem[] = [
    {
      route: '/home',
      text: 'Home',
      href: undefined
    },
  ];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.initialise();
  }
}
