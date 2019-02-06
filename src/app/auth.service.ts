import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

// Client ID and API key from the Developer Console.
// This is the Trust Networks Credential Manager application.
const CLIENT_ID = '1041863416400-luuj7j2h8a1mdi454hf2lnqqngfrbevc.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://people.googleapis.com/$discovery/rest?version=v1'
];

// Authorisation scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/userinfo.email \
https://www.googleapis.com/auth/userinfo.profile \
https://www.googleapis.com/auth/plus.me';

export enum SignedInState {
  Unknown,
  SignedIn,
  NotSignedIn
}

export class BasicProfile {
  id: string;
  fullName: string;
  givenName: string;
  familyName: string;
  imageURL: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private gapi = null;
  signedIn = SignedInState.Unknown;
  private signedIn$ = new BehaviorSubject<number>(this.signedIn);

  constructor() {}

  initialise() {
    if (this.gapi == null) {
      this.gapi = window['gapi'];
    }

    if (this.gapi != null) {
      this.gapi.load('client:auth2', () => this.initClient());
    }
  }

  //
  // Initialises the API client library and sets up sign-in state
  // listeners.
  //
  initClient() {
    this.gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(() => {
      // Listen for sign-in state changes.
      this.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => this.updateSigninStatus(isSignedIn));
      // Handle the initial sign-in state.
      this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());

    });
  }

  updateSigninStatus(isSignedIn) {
    this.signedIn = isSignedIn ? SignedInState.SignedIn : SignedInState.NotSignedIn;
    this.signedIn$.next(this.signedIn);
  }

  isSignedIn(): Observable<number> {
    return this.signedIn$;
  }

  signIn() {
    if (this.gapi != null) {
      this.gapi.auth2.getAuthInstance().signIn();
    }
  }

  signOut() {
    if (this.gapi != null) {
      this.gapi.auth2.getAuthInstance().signOut();
    }
  }

  getAccessToken(): string {
    if (this.gapi != null) {
      return this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    } else {
      return '';
    }
  }

  getBasicProfile(): BasicProfile {
    if (this.gapi != null) {
      const profile = this.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

      const basicProfile = new BasicProfile();
      basicProfile.id = profile.getId();
      basicProfile.fullName = profile.getName();
      basicProfile.givenName = profile.getGivenName();
      basicProfile.familyName = profile.getFamilyName();
      basicProfile.imageURL = profile.getImageUrl();
      basicProfile.email = profile.getEmail();

      return basicProfile;
    } else {
      return null;
    }
  }

}
