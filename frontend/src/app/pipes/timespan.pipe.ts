import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timespan'
})
export class TimespanPipe implements PipeTransform {

  transform(timeInSeconds: number): any {
    return Math.round(timeInSeconds % 3600) + ':' + Math.round(timeInSeconds % 60) + ':' + timeInSeconds / 60;
  }

}
