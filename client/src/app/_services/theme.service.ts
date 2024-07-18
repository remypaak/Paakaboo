import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Theme } from '../_models/theme';
import { Observable, of, ReplaySubject, shareReplay, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  activeTheme$: Observable<Theme> | null = null;


  startNewThemeChallenges(theme: Theme) {
    return this.http.post<Theme>(this.baseUrl + 'theme/add-theme', theme);
  }

  getActiveTheme(): Observable<Theme> {
    if (!this.activeTheme$) {
      return this.activeTheme$ = this.http.get<Theme>(`${this.baseUrl}theme/get-active-theme`).pipe(
        shareReplay(1)
      )
    }
    return this.activeTheme$
  }


  clearCache() {
    this.activeTheme$ = null;
  }
}

