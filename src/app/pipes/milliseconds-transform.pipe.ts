import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondsTransform'
})
export class MillisecondsTransformPipe implements PipeTransform {

  transform(value: number | null, ...args: unknown[]): number {
    if(value){
      return Number((value / 1000).toFixed(2));
    }else {
      return 0
    }
  }

}
