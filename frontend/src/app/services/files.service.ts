import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { File } from '../model/file';
import { Observable } from 'rxjs';
import { UrlService } from 'src/app/services/url.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService) { }

  public getFiles(mediaType: string = 'audio'): Observable<File[]> {
    return this.httpClient.get<File[]>(this.urlService.getUrlForPath(`/api/files/${mediaType}`));
  }

  public getFile(filename: string): void {
    window.location.href = this.urlService.getUrlForPath(`/api/files/${filename}`);
  }

  public startStream(filename: string): void {
    window.location.href = this.urlService.getUrlForPath(`/api/streams/${filename}`);
  }
  
  public deleteFile(filename: string): Observable<File[]> {
    return this.httpClient.delete<File[]>(this.urlService.getUrlForPath(`/api/files/${filename}`));
  }

  public getMediaDirectories(): Observable<any> {
    return this.httpClient.get<any>(this.urlService.getUrlForPath(`/api/files/media-directories`));
  }
}
