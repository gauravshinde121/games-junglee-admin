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


      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return (aValue === bValue ? 0 : aValue ? -1 : 1) * multiplier;
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * multiplier;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return (aValue.getTime() - bValue.getTime()) * multiplier;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Convert date strings to Date objects for sorting
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);

        // Check if conversion was successful before sorting
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return (aDate.getTime() - bDate.getTime()) * multiplier;
        } else {
          return aValue.localeCompare(bValue) * multiplier;
        }
      } else {
        return 0; // For other data types, keep their relative order unchanged
      }

    });
  }

}
