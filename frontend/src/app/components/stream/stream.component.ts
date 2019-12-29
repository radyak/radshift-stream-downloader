import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  fileName: string;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(
      (params) => this.fileName = params.get('filename')
    );
  }

  ngOnInit() {
  }

}
