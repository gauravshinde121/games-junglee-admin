// import { DecimalPipe } from '@angular/common';
// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'formattednumber'
// })
// export class FormattednumberPipe implements PipeTransform {

//   constructor(private decimalPipe: DecimalPipe) {}

//   transform(value: number): string {
//     return this.decimalPipe.transform(value / 100000, '1.0-1') + ' Lacs';
//   }

// }

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formattednumber'
 })
export class FormattednumberPipe implements PipeTransform {

  transform(value: number): string {
    
    if (value >= 10000000 && value < 100000000) {
      return +(value / 10000000).toFixed(1).replace(/\.0+$/,'') + ' Cr';
    }
    else if (value >= 100000000) {
       return +(value / 10000000).toFixed(1).replace(/\.0+$/,'') + ' Cr';
       }
    else if (value >= 1000000) { 
      return +(value / 100000).toFixed(1).replace(/\.0+$/,'') + ' lac'; 
    }
    else if (value >= 100000) { 
      return +(value / 100000).toFixed(1).replace(/\.0+$/,'') + ' lac'; 
    }
    else if (value >= 1000) { 
      return +(value / 1000).toFixed(1).replace(/\.0+$/,'') + ' K'; 
    } else { return value.toString(); 
    }
  }
}
