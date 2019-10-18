import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService) { }

  public getInfoForVideo(videoUrl: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlService.getUrlForPath(`/api/info/video?url=${videoUrl}`));
  }

}
