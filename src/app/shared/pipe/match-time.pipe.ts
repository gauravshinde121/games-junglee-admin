import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'matchTime'
})
export class MatchTimePipe extends DatePipe implements PipeTransform{

  transform(value: any): any {
    const today = new Date();
    const date = new Date(value);
    if (date.toDateString() === today.toDateString()) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';

      let formattedHours = hours % 12;
      formattedHours = formattedHours ? formattedHours : 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      return `Today At ${formattedHours}:${formattedMinutes} ${period}`;
    } else {
      return super.transform(value, "EEEE 'At' h:mm a");
    }
  }

}
