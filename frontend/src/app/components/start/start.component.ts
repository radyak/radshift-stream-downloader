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

  public DEBUG_PARAMS;

  constructor(
    private route: ActivatedRoute,
    private downloadService: DownloadsService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.DEBUG_PARAMS = JSON.stringify({...params.keys, ...params});
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
        console.log(download);
        this.router.navigate(['downloads']);
        this.loading = false;
      });
  }

}
