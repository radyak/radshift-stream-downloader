import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { File } from 'src/app/model/file';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  private files: File[];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.backendService.getFiles().subscribe(data => {
      this.files = data
    });
  }

  download(file: string): void {
    this.backendService.getFile(file);
  }

  // getDisplayFileSize(sizeInBytes: number): string {
  //   if (sizeInBytes < 1024) {
  //     return `${this.round(sizeInBytes)} byte`
  //   }
  //   let sizeInKb = sizeInBytes / 1024
  //   if (sizeInKb < 1024) {
  //     return `${this.round(sizeInKb)} kB`
  //   }
  //   let sizeInMb = sizeInKb / 1024
  //   if (sizeInMb < 1024) {
  //     return `${this.round(sizeInMb)} MB`
  //   }
  //   return `${this.round(sizeInMb) / 1024} GB`
  // }

  // round(number: number): number {
  //   return Math.round(number * 100) / 100
  // }
}
