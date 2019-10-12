import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  private audioOnly: boolean = false;
  private link: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('link')) {
        this.link = decodeURIComponent(params.get('link'));
      }
      this.audioOnly = params.get('type') === 'audio';
    })
  }

  startDownload(): void {
    
  }

}
