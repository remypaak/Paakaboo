import { Component, inject } from '@angular/core';
import { SubmissionAreaComponent } from './submission-area/submission-area.component';
import { VotingGalleryComponent } from "./voting-gallery/voting-gallery.component";
import { ThemeService } from '../../../_services/theme.service';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-current-challenge',
  standalone: true,
  imports: [SubmissionAreaComponent, VotingGalleryComponent, AsyncPipe],
  templateUrl: './current-challenge.component.html',
  styleUrl: './current-challenge.component.scss'
})
export class CurrentChallengeComponent {
    private themeService = inject(ThemeService);
    activeTheme$ = this.themeService.getActiveTheme().pipe(
        tap(()=> this.isLoading = false)
    )
  currentDate: Date = new Date();
  isLoading = true;

    isBeforeSubmitEndDate(theme: any): boolean {
        const submitEndDate = new Date(theme.submitEndDate);
        return this.currentDate < submitEndDate;
      }
    
      isDuringVotingPeriod(theme: any): boolean {
        const submitEndDate = new Date(theme.submitEndDate);
        const voteEndDate = new Date(theme.voteEndDate);
        return this.currentDate >= submitEndDate && this.currentDate <= voteEndDate;
      }
}
