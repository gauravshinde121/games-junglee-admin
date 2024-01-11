import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundToHalf'
})
export class RoundToHalfPipe implements PipeTransform {
  transform(value: number): number | string {
    if (value % 1 === 0) {
      return Math.round(value);
    } else {
      return Math.round(value * 2) / 2;
    }
  }
}