import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/services/files.service';
import { File } from 'src/app/model/file';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  private files: File[];

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

}
