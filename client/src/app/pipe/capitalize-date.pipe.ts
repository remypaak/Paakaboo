import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeDate',
  standalone: true,
})
export class CapitalizeDatePipe implements PipeTransform {
    transform(value: string | null): string | null {
      if (!value) return value;
      return value.replace(/\b\w/g, char => char.toUpperCase());
    }
  }
  
