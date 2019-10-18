import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadsService } from 'src/app/services/downloads.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  public audioOnly: boolean = false;
  public link: string;
  public loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private downloadService: DownloadsService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('url')) {
        this.link = decodeURIComponent(params.get('url'));
      }
      if (params.get('text')) {
        this.link = decodeURIComponent(params.get('text'));
      }
      this.audioOnly = params.get('type') === 'audio';
    })
  }

  startDownload(): void {
    this.loading = true;
    this.downloadService.startDownload(this.link, this.audioOnly)
      .subscribe(download => {
        this.router.navigate(['downloads']);
        this.loading = false;
      });
  }

}
