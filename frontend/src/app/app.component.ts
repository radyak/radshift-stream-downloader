import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  navLinks: any[];
  activeLinkIndex = -1;

  constructor(
    private router: Router, 
    private route: ActivatedRoute) {
    this.navLinks = [
      {
        label: 'Start',
        link: './start',
        index: 0
      }, {
        label: 'Downloads',
        link: './downloads',
        index: 1
      }, {
        label: 'Files',
        link: './files',
        index: 2
      }, 
    ];


    this.router.events.subscribe((event: any): void => {
      if (event instanceof NavigationStart) {
        event = event as NavigationStart
        console.log('event.ActivatedRoute:', event)

        this.route.queryParamMap.subscribe(params => {
          let token = params.get('token');
          if (token) {
            console.log(`I received a token: ${token}`)
          }
        });

      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

}
