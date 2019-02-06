import { Component, OnInit, Input } from '@angular/core';

export interface NavBarMenuItem {
  route: string;
  text: string;
  href: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public isNavbarCollapsed = true;
  @Input() menuItems: NavBarMenuItem[];
  @Input() title: string;
  constructor() { }

  ngOnInit() {
  }

}
