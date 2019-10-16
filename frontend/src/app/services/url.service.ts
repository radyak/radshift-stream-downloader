import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(private locationStrategy: LocationStrategy) { }

  getBaseUrl(): string {    
    let baseUrl = location.origin + this.locationStrategy.getBaseHref();
    return baseUrl
  }

  getWsBaseUrl(): string {    
    let baseUrl = this.getBaseUrl();
    
    console.log(`Replacing ${baseUrl}`);
    baseUrl = baseUrl.replace(/http/g, 'ws');
    console.log(`with ${baseUrl}`);

    return baseUrl
  }

}
