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

    return array.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * multiplier;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * multiplier;
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        // For boolean values, sort true before false in ascending order
        return (aValue === bValue ? 0 : aValue ? -1 : 1) * multiplier;
      } else {
        // For other types, maintain their original order
        return 0;
      }
    });
  }


}
