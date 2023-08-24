import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: any[], searchTerm: string): any[] {
    if (!searchTerm) {
      return data;
    }

    const searchTermLowerCase = searchTerm.toLowerCase();

    return data.filter(item =>
      Object.values(item).some((value: any) => {
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchTermLowerCase);
        }
        return false;
      })
    );
  }

}
