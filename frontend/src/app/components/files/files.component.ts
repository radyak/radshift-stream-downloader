import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/services/files.service';
import { File } from 'src/app/model/file';
import { Router } from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  public files: File[];
  public sortBy: string = 'name';
  public mediaType: string = 'audio';


  constructor(
    private router: Router,
    private filesService: FilesService) { }

  ngOnInit() {
    this.filesService.getFiles(this.mediaType).subscribe(data => {
      this.files = data
    });
  }

  download(file: string): void {
    this.filesService.getFile(file);
  }

  startStream(file: string): void {
    this.router.navigate(['/stream', file]);
    // this.filesService.startStream(file);
  }

  deleteFile(file: string): void {
    this.filesService.deleteFile(file).subscribe(data => {
      this.files = data
    });
  }

  setSort(sortBy: string) {
    this.sortBy = this.sortBy === sortBy ? null : sortBy;
  }

  setFilter(mediaType: string) {
    this.mediaType = this.mediaType === mediaType ? null : mediaType;
    this.filesService.getFiles(this.mediaType).subscribe(data => {
      this.files = data
    });
  }

  getStructuredFiles(): File[] {
    let files: File[] = this.files;
    if (!files) {
      return [];
    }
    if (this.sortBy) {
      files = files.sort((fileA, fileB) => ('' + fileA[this.sortBy]).localeCompare('' + fileB[this.sortBy]));
    }
    files.forEach(file => file.title = file.name.replace(/\.mp[34]*/g, ''));
    return files;
  }
}
