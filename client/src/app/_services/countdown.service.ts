import { Injectable, signal } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TimeComponents } from '../_models/time-components';

@Injectable({
  providedIn: 'root',
})
export class CountdownTimerService {
  timeLeft = signal<TimeComponents | null>(null);

  public getTimeLeft(
    endDay: Date = new Date(2024, 9, 1)
  ): Observable<number> {
    return interval(1000).pipe(
    tap(() => this.timeLeft.set(this.calcDateDiff(endDay))));
  }

  private calcDateDiff(endDay: Date): TimeComponents {
    const dDay = endDay.valueOf();
    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const daysToDday = Math.floor(
      timeDifference /
        (milliSecondsInASecond *
          minutesInAnHour *
          secondsInAMinute *
          hoursInADay)
    );

    const hoursToDday = Math.floor(
      (timeDifference /
        (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
        hoursInADay
    );

    const minutesToDday = Math.floor(
      (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
        secondsInAMinute
    );

    const secondsToDday =
      Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

    return { secondsToDday, minutesToDday, hoursToDday, daysToDday };
  }
}
