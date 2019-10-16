import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from 'src/app/services/url.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService) { }

  startDownload(url: string, audioOnly: boolean = false): Observable<any> {
    return this.httpClient.post<any>(`${ this.urlService.getBaseUrl() }/api/downloads`, {
      url: url,
      audioOnly: audioOnly
    });
  }

  getAllDownloads(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${ this.urlService.getBaseUrl() }/api/downloads`);
  }

}
