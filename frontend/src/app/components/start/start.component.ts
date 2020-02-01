import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadsService } from 'src/app/services/downloads.service';
import { InfoService } from 'src/app/services/info.service';
import { min } from 'rxjs/operators';
import { FilesService } from 'src/app/services/files.service';

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

  private mediaDirectories: any;
  private selectedMediaDirectory: string = 'Downloads';
  private customMediaDirectory: string;

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
    private router: Router,
    private filesService: FilesService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let url = params.get('url') || params.get('text');
      if (url && url !== 'undefined') {
        this.setUrl(decodeURIComponent(url));
      }
      this.audioOnly = params.get('type') === 'audio';
    })

    this.filesService.getMediaDirectories().subscribe(mediaDirectories => {
      this.mediaDirectories = mediaDirectories;
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

  getDuration(): string {
    let seconds = this.videoInfo.duration % 60
    let minutes = Math.floor(this.videoInfo.duration / 60)
    let hours = Math.floor(minutes / 3600)

    let hoursString = hours < 10 ? `0${hours}` : hours
    let minutesString = minutes < 10 ? `0${minutes}` : minutes
    let secondsString = seconds < 10 ? `0${seconds}` : seconds

    return minutes > 20 ? `${hoursString}:${minutesString}:${secondsString}` : `${minutesString}:${secondsString}`
  }

  startDownload(): void {
    this.loading = true;
    let mediaDirectory = this.selectedMediaDirectory === 'CUSTOM' ? this.customMediaDirectory : this.selectedMediaDirectory;
    this.downloadService.startDownload(this.url, this.audioOnly, mediaDirectory)
      .subscribe(download => {
        this.router.navigate(['downloads']);
        this.loading = false;
      });
  }

  getMediaDirectories() {
    if (!this.mediaDirectories) {
      return []
    }
    let mediaDirectories = this.audioOnly ? this.mediaDirectories.audio : this.mediaDirectories.video;
    return mediaDirectories.sort();
  }

}
