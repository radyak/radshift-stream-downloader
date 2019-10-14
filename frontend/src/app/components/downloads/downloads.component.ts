import { Component, OnInit } from '@angular/core';
import { DownloadsService } from 'src/app/services/downloads.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  downloads: any[] = [];
  loading: boolean = false;
  
  constructor(private downloadsService: DownloadsService) { }

  ngOnInit() {
    this.loading = true;
    this.downloadsService.getAllDownloads().subscribe((downloads: Map<string, any>) => {
      this.loading = false;
      this.downloads = [];
      for (var key in downloads){
        downloads.hasOwnProperty(key) && this.downloads.push(downloads[key])
     }
     
    })
  }

  timeString(timeInSeconds: number): string {
    return Math.round(timeInSeconds) + ' s'
  }

}
