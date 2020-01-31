import { Component, OnInit } from '@angular/core';
import { DownloadsService } from 'src/app/services/downloads.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { UrlService } from 'src/app/services/url.service';
import { timer, Subscription } from 'rxjs';


@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  public downloads: any[] = [];
  public loading: boolean = false;
  public socket: WebSocketSubject<any>;
  private socketSubscription: Subscription;
  private wsConnectRetryCount: number = 0;

  constructor(
    private downloadsService: DownloadsService,
    private urlService: UrlService) {
  }

  ngOnInit() {
    this.loading = true;
    this.update();

    let socketUrl = this.urlService.getWsUrlForPath('/api/downloads');
    this.socket = new WebSocketSubject(socketUrl);

    this.socketSubscription = this.socket.subscribe(event => {
      
      let download = this.downloads.find(download => download.id === event.id);

      if (download) {
        download.status = event.status;
        download.filename = event.filename;
        download.percentage = event.percentage;
        download._percent_str = event._percent_str;
        download._eta_str = event._eta_str;
      } else {
        this.update();
      }
    }, (error) => {
      if (error instanceof CloseEvent && this.wsConnectRetryCount <= 3) {
        this.socketSubscription.unsubscribe();
        this.socket.unsubscribe();
        this.downloads.forEach(download => {
          download.status = 'RECONNECTING';
        })
        this.wsConnectRetryCount++;
        timer(2000).subscribe(() => this.ngOnInit.apply(this));
      } else {
        this.downloads.forEach(download => {
          download.status = 'ERROR';
        })
      }
    })

  }

  getPercentage(percentageString) {
    return parseInt(percentageString) / 100
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

}
