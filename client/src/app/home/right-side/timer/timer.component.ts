import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimerService } from '../../../_services/countdown.service';
import { ThemeService } from '../../../_services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy{
    public timeLeftService = inject(CountdownTimerService)
    private themeService = inject(ThemeService);
    countDownSubscription: Subscription | null = null;
    
    ngOnInit(): void {
        this.themeService.getActiveThemeEndDate().subscribe({
            next: (response) => {
                const endDate = response.activeThemeEndDate ? new Date(response.activeThemeEndDate) : null;
                this.countDownSubscription = this.timeLeftService.getTimeLeft(endDate).subscribe()
            }
        })
    }

    ngOnDestroy(): void {
        if (this.countDownSubscription){
            this.countDownSubscription.unsubscribe()
        }
    }
}
