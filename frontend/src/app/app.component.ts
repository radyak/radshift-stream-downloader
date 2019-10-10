import { Component, OnInit } from '@angular/core';
import { BackendService } from './service/backend.service';
import { File } from './model/file';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private files: File[];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.backendService.getFiles().subscribe(data => {
      this.files = data
    }); 
  }

  download(file: string) {
    this.backendService.getFile(file).subscribe(res => {
      console.log(res)
    }); 
  }

}
