import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService
  ) { }

  public getAuth(): Observable<any> {
    return this.httpClient.get<any>(this.urlService.getUrlForPath(`/api/info/auth`));
  }

}
