import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimerService } from '../../_services/countdown.service';
import { ThemeService } from '../../_services/theme.service';
import { Subscription, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy{
    public timeLeftService = inject(CountdownTimerService)
    private themeService = inject(ThemeService);
    countDownSubscription: Subscription | null = null;
    
    ngOnInit(): void {
        this.countDownSubscription = this.themeService.getActiveTheme().pipe(
            switchMap(theme => this.timeLeftService.getTimeLeft(theme?.submitEndDate))).subscribe()
    }

    ngOnDestroy(): void {
        if (this.countDownSubscription){
            this.countDownSubscription.unsubscribe()
        }
        this.themeService.clearCache()
    }
}
