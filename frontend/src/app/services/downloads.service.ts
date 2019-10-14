import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {

  private BASE_URL: string = environment.serverUrl;

  constructor(private httpClient: HttpClient) { }

  startDownload(url: string, audioOnly: boolean = false): Observable<any> {
    return this.httpClient.post<any>(`${this.BASE_URL}/api/downloads`, {
      url: url,
      audioOnly: audioOnly
    });
  }

  getAllDownloads(): Observable<Map<string, any>> {
    return this.httpClient.get<any>(`${this.BASE_URL}/api/downloads`);
  }

}
