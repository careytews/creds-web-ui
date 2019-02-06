import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService, SignedInState, BasicProfile } from '../auth.service';
import { CredentialsService, ListCredentialsResponse, CredentialsInfo, CredentialsDownloadResponse } from '../credentials.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  signedInState = SignedInState.NotSignedIn;
  focus = false;
  signedInStateSignedInType = SignedInState.SignedIn;
  signedInStateNotSignedInType = SignedInState.NotSignedIn;
  signedInStateUnknownType = SignedInState.Unknown;
  webCredentials: CredentialsInfo[] = [];
  vpnCredentials: CredentialsInfo[] = [];
  basicProfile: BasicProfile = null;
  credsListRetrieved = false;
  credsListError = '';

  // The selected web credential
  selected: CredentialsInfo = null;

  constructor(private authService: AuthService,
    private credsService: CredentialsService,
    private ngZone: NgZone) {
  }

  ngOnInit() {
    this.authService.isSignedIn().subscribe((s: SignedInState) => {
      this.ngZone.run(() => {
        this.signedInState = s;
        if (this.signedInState === SignedInState.SignedIn) {
          this.getCredsList();
          this.basicProfile = this.authService.getBasicProfile();
        }
      });
    });
  }

  ngAfterViewInit() {

  }

  onFocus(focus) {
    this.focus = focus;
  }

  signIn() {
    this.authService.signIn();
  }

  signOut() {
    this.authService.signOut();
    this.webCredentials = [];
    this.vpnCredentials = [];
    this.credsListRetrieved = false;
    this.credsListError = '';
    this.setSelected(-1);
  }

  getCredsList() {
    const token = this.authService.getAccessToken();
    this.credsService.listCreds(token)
      .subscribe((response: ListCredentialsResponse) => {

        this.webCredentials = [];
        this.vpnCredentials = [];
        this.credsListRetrieved = true;
        if (response.credentials != null) {
          let index = 0;
          response.credentials.forEach(creds => {
            creds.pass = '';
            creds.revealed = false;
            if (creds.type === 'web') {
              // The index only applies to the web creds
              creds.index = index;
              index += 1;
              this.webCredentials.push(creds);
            } else if (creds.type === 'vpn') {
              this.vpnCredentials.push(creds);
            }
          });
        }
      },
        error => this.credsListError = error
      );
  }

  fileSaveBase64(base64: string, filename: string) {

    // decode base64
    const data = atob(base64);

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(data.length);

    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob
    const blob = new Blob([ab], { type: 'application/x-binary' });
    FileSaver.saveAs(blob, filename);

  }

  // Selected is used by the app to know which of the creds to download and which password to reveal
  setSelected(index: number) {
    if (this.selected != null) {
      this.selected.pass = '';
      this.selected.revealed = false;
    }

    if (index === -1) {
      this.selected = null;
    } else {
      this.selected = this.webCredentials[index];
    }
  }

  downloadWebCreds(index: number) {
    const token = this.authService.getAccessToken();
    this.setSelected(index);
    this.credsService.downloadCreds(token, this.selected.id)
      .subscribe((response: CredentialsDownloadResponse) => {

        // save the creds file
        this.fileSaveBase64(response.data, response.name + '.p12');

        this.selected.pass = atob(response.password);
      });
  }

  downloadVPNCreds(name: string, region: string) {
    const token = this.authService.getAccessToken();

    // find the creds being asked for
    const creds = this.vpnCredentials.find(cred => cred.name === name);

    if (creds !== undefined) {
      this.credsService.downloadCreds(token, creds.id + '-' + region + '.ovpn')
        .subscribe((response: CredentialsDownloadResponse) => {

        // save the creds file
        this.fileSaveBase64(response.data, response.filename);
      });
    }
  }

  revealPassword(reveal: boolean) {
    this.selected.revealed = reveal;
  }
}
