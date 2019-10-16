import { Component, OnInit } from '@angular/core';
import { DownloadsService } from 'src/app/services/downloads.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { UrlService } from 'src/app/services/url.service';


@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  public downloads: any[] = [];
  public loading: boolean = false;
  public socket: WebSocketSubject<any>;

  constructor(
    private downloadsService: DownloadsService,
    private urlService: UrlService) {
  }

  ngOnInit() {
    this.loading = true;
    this.update();

    let socketUrl = this.urlService.getWsUrlForPath('/api/downloads');
    this.socket = new WebSocketSubject(socketUrl);

    this.socket.subscribe(event => {
      
      let download = this.downloads.find(download => download.id === event.id);

      if (download) {
        download.status = event.status;
        download.progress.eta = event.eta;
        download.progress.percentage = event.percentage;
        download.progress.speed = event.speed;
      } else {
        this.update();
      }
    })

  }

  update(): void {
    this.downloadsService.getAllDownloads().subscribe((downloads: any[]) => {
      this.loading = false;
      this.downloads = downloads;
    });
  }

  public removeDownload(download): void {
    this.downloads = this.downloads.filter(currDownload => {
      currDownload !== download
    });
  }

  timeString(timeInSeconds: number): string {
    return timeInSeconds ? Math.round(timeInSeconds) + ' s' : 'unknown'
  }

}
