import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {

  transform(fileSizeInBytes: number): string {
    if (fileSizeInBytes < 1024) {
      return `${this.round(fileSizeInBytes)} byte`
    }
    let fileSizeInKb = fileSizeInBytes / 1024
    if (fileSizeInKb < 1024) {
      return `${this.round(fileSizeInKb)} kB`
    }
    let fileSizeInMb = fileSizeInKb / 1024
    if (fileSizeInMb < 1024) {
      return `${this.round(fileSizeInMb)} MB`
    }
    return `${this.round(fileSizeInMb) / 1024} GB`
  }

  round(number: number): number {
    return Math.round(number * 100) / 100
  }

}
