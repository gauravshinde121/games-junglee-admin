import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], field: string, ascending: boolean = true): any[] {
    if (!array || !field) {
      return array;
    }

    const multiplier = ascending ? 1 : -1;

    return array.sort((a, b) =>
      a[field].localeCompare(b[field]) * multiplier
    );
  }

}
