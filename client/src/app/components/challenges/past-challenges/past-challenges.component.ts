import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../_services/theme.service';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ThemeResponse } from '../../../_models/themeResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-challenges',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './past-challenges.component.html',
  styleUrls: ['./past-challenges.component.scss'],
})
export class PastChallengesComponent implements OnInit {
  public themeService = inject(ThemeService);
  private router = inject(Router);
  pastThemes$: Observable<ThemeResponse[] | null> = new Observable<
    ThemeResponse[] | null
  >();

  ngOnInit(): void {
    this.pastThemes$ = this.themeService.getPastThemes().pipe(
      map(themes => themes.sort((a, b) => b.weekNumber - a.weekNumber))
    );
  }

  viewPastChallengeDetails(theme: ThemeResponse) {
    this.router.navigate(['/past-challenge-details', theme.id], {
      state: { theme },
    });
  }
}
