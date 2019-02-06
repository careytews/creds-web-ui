import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

export interface CredentialsInfo {
  id: string;
  type: string;
  name: string;
  description: string;
  start: string;
  end: string;
  // Only used for web creds
  pass: string;
  revealed: boolean;
  index: number;
}

export interface ListCredentialsResponse {
  credentials: CredentialsInfo[];
}

export interface CredentialsDownloadResponse {
  name: string;
  filename: string;
  data: string;
  password: string;
}

const credsUrl = '/api/creds';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    // Everything that has an error will already have printed something to the console.
    // We don't actually need to give them any more clues.

    // return an observable with a user-facing error message
    return throwError(
      'An error occurred. Please try again later.');
  }

  listCreds(token: string): Observable<ListCredentialsResponse> {
    return this.httpClient.get<ListCredentialsResponse>(credsUrl, {
      headers: new HttpHeaders().set('Authorization', token)})
    .pipe(
      retry(2), // retry a failed request up to 2 times
      catchError(this.handleError) // then handle the error
    );
  }

  downloadCreds(token: string, id: string): Observable<CredentialsDownloadResponse> {
    return this.httpClient.get<CredentialsDownloadResponse>((credsUrl + '/' + id), {
      headers: new HttpHeaders().set('Authorization', token)});
    }
  }
