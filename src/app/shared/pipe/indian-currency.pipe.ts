import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }

    // Format the number without currency symbol and decimal values
    const formattedValue = new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

    return formattedValue;
  }

}
