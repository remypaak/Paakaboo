import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeDate',
  standalone: true,
})
export class CapitalizeDatePipe implements PipeTransform {
  transform(
    value: Date | null | string | undefined,
    format: string = 'MMMM d, yyyy',
    locale: string = 'nl'
  ): string | null {
    if (!value) return null;

    const date = new Date(value);

    const datePipe = new DatePipe(locale);

    const formattedDate = datePipe.transform(date, format);
    console.log(formattedDate);
    if (formattedDate) {
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
  }
}
