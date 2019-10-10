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

}
