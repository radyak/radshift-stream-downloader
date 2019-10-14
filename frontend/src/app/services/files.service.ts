import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { File } from '../model/file';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private BASE_URL:string = environment.serverUrl;

  constructor(private httpClient: HttpClient) { }

  public getFiles(): Observable<File[]> {
    return this.httpClient.get<File[]>(`${this.BASE_URL}/api/files`);
  }

  public getFile(filename: string): void {
    window.location.href = `${this.BASE_URL}/api/files/${filename}`;
  }

  public startStream(filename: string): void {
    window.location.href = `${this.BASE_URL}/api/streams/${filename}`;
  }
}
