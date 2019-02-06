import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../environments/environment';
import {
  ProfileConfig,
  TNW_PROFILE_CONFIG,
  TnwComponentsModule,
} from 'tnw-components';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomePageComponent } from './home-page/home-page.component';

const profileConfig: ProfileConfig = new ProfileConfig({
  themes: [
    'tnw-dark',
  ],
  defaultTheme: 'tnw-dark',
  flags: [
    {
      title: 'Enable demo extensions',
      key: 'enable_demo',
      defaultValue: true,
      domain: 'trustnetworks.com',
    },
  ],
});
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomePageComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    TnwComponentsModule.forRoot({
      provide: TNW_PROFILE_CONFIG,
      useValue: profileConfig
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
