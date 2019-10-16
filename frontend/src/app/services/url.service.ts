import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(private locationStrategy: LocationStrategy) { }

  getUrlForPath(path: string = ''): string {    
    let baseUrl = location.origin + this.locationStrategy.getBaseHref();
    let url = `${baseUrl}/${path}`;
    url = url .replace(/(:\/\/)|(\/)+/g, "$1$2");
    return url
  }

  getWsUrlForPath(path: string = ''): string {    
    let baseUrl = this.getUrlForPath(path);
    return baseUrl.replace(/http/g, 'ws');
  }

}
