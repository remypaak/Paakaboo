import { Component, inject, OnInit } from '@angular/core';
import { SubmissionAreaComponent } from './submission-area/submission-area.component';
import { VotingGalleryComponent } from './voting-gallery/voting-gallery.component';
import { ThemeService } from '../../../_services/theme.service';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-current-challenge',
  standalone: true,
  imports: [SubmissionAreaComponent, VotingGalleryComponent, AsyncPipe],
  templateUrl: './current-challenge.component.html',
  styleUrl: './current-challenge.component.scss',
})
export class CurrentChallengeComponent implements OnInit {
  public themeService = inject(ThemeService);

  currentDate: Date = new Date();
  isLoading = true;

  ngOnInit(): void {
    if (!this.themeService.activeTheme()) {
      this.getActiveTheme();
    }
  }

  getActiveTheme() {
    this.themeService
      .getActiveTheme()
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe();
  }
  
  isBeforeSubmitEndDate(theme: any): boolean {
    const submitEndDate = new Date(theme.submitEndDate);
    return this.currentDate < submitEndDate;
  }

  isDuringVotingPeriod(theme: any): boolean {
    const submitEndDate = new Date(theme.submitEndDate);
    const trophyEndDate = new Date(theme.trophyEndDate);
    return this.currentDate >= submitEndDate && this.currentDate <= trophyEndDate;
  }
}
