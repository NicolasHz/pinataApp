import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splice'
})
export class SplicePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/ .*/, '');
  }

}
