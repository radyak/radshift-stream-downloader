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

    let socketUrl = `${ this.urlService.getWsBaseUrl() }api/downloads`;
    console.log(`Connecting to ws ${socketUrl}`)
    this.socket = new WebSocketSubject(socketUrl);
    console.log(`Connected`)

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

  timeString(timeInSeconds: number): string {
    return timeInSeconds ? Math.round(timeInSeconds) + ' s' : 'unknown'
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'STARTING': return 'Starting ...';
      case 'ERROR': return 'Error';
      case 'FINISHED': return 'Finished';
      case 'COMPLETE_CONVERTING': return 'Download complete. Converting ...';
      case 'IN_PROGRESS': return 'In Progress';
    }
  }

}
