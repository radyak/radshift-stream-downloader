import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/services/files.service';
import { File } from 'src/app/model/file';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  public files: File[];
  public sortBy: string = 'name';
  public filterBy: string;


  constructor(private filesService: FilesService) { }

  ngOnInit() {
    this.filesService.getFiles().subscribe(data => {
      this.files = data
    });
  }

  download(file: string): void {
    this.filesService.getFile(file);
  }

  startStream(file: string): void {
    this.filesService.startStream(file);
  }

  deleteFile(file: string): void {
    this.filesService.deleteFile(file).subscribe(data => {
      this.files = data
    });
  }

  setSort(sortBy: string) {
    this.sortBy = this.sortBy === sortBy ? null : sortBy;
  }

  setFilter(filterBy: string) {
    this.filterBy = this.filterBy === filterBy ? null : filterBy;
  }

  getStructuredFiles(): File[] {
    let files: File[] = this.files;
    if (!files) {
      return [];
    }
    if (this.sortBy) {
      files = files.sort((fileA, fileB) => ('' + fileA[this.sortBy]).localeCompare('' + fileB[this.sortBy]));
    }
    if (this.filterBy) {
      let filterExtensions: string[] = this.filterBy === 'music' ? ['mp3'] : ['mp4']
      files = files.filter(file => filterExtensions.indexOf(file.extension) !== -1);
    }
    files.forEach(file => file.title = file.name.replace(/\.mp[34]*/g, ''));
    return files;
  }
}
