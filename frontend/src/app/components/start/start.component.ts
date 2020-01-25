import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadsService } from 'src/app/services/downloads.service';
import { InfoService } from 'src/app/services/info.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  public audioOnly: boolean = false;
  public url: string;
  public loading: boolean = false;

  public videoInfo: any;
  public videoInfoLoading: boolean = false;

  private urlPattern: RegExp = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
      '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$',
  'i');

  constructor(
    private route: ActivatedRoute,
    private downloadService: DownloadsService,
    private infoService: InfoService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let url = params.get('url') || params.get('text');
      if (url && url !== 'undefined') {
        this.setUrl(decodeURIComponent(url));
      }
      this.audioOnly = params.get('type') === 'audio';
    })
  }

  setUrl(url: string): void {
    this.url = url;
    if (this.isUrl(url)) {
      this.tryLoadInfo(url);
    }
  }


  isUrl(toCheck: string): boolean {
    return this.urlPattern.test(toCheck);
  }

  tryLoadInfo(url: string): void {
    this.videoInfoLoading = true;
    this.infoService.getInfoForVideo(url).subscribe(
      (info) => {
        this.videoInfoLoading = false;
        this.videoInfo = info;
      },
      (error) => {
        this.videoInfoLoading = false;
      }
    );
  }

  startDownload(): void {
    this.loading = true;
    var option = this.audioOnly ? this.videoInfo.audioOption : this.videoInfo.videoOption
    this.downloadService.startDownload(this.url, option, this.audioOnly)
      .subscribe(download => {
        this.router.navigate(['downloads']);
        this.loading = false;
      });
  }

}
