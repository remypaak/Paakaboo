import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimerService } from '../../_services/countdown.service';
import { ThemeService } from '../../_services/theme.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit, OnDestroy {
  public timeLeftService = inject(CountdownTimerService);
  private themeService = inject(ThemeService);
  countDownSubscription: Subscription | null = null;

  ngOnInit(): void {
    if (!this.themeService.activeTheme()) {
      this.getActiveTheme().subscribe({
        complete: () => this.countDown()
      });
    }
    else{
        this.countDown();
    }
  }

  getActiveTheme() {
    return this.themeService.getActiveTheme();
  }

  countDown() {
    this.countDownSubscription = this.timeLeftService
        .getTimeLeft(
          this.themeService.activeTheme()?.submitEndDate,
          this.themeService.activeTheme()?.voteEndDate
        )
        .subscribe();
    
  }

  ngOnDestroy(): void {
    if (this.countDownSubscription) {
      this.countDownSubscription.unsubscribe();
    }
    this.themeService.clearCache();
  }
}
