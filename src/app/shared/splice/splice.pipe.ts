import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splice'
})
export class SplicePipe implements PipeTransform {
  transform(value: any): any {
    return value.replace(/ .*/, '');
  }
}
