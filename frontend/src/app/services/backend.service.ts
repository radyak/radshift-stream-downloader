import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { File } from '../model/file';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public getFiles(): Observable<File[]> {
    return this.httpClient.get<File[]>('http://localhost:3009/api/files');
  }

  public getFile(filename: string): void {
    window.location.href = `http://localhost:3009/api/files/${filename}`;
  }
}
