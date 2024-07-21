import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ThemeRequest } from '../_models/themeRequest';
import { Observable, of, ReplaySubject, shareReplay, take, tap } from 'rxjs';
import { ThemeResponse } from '../_models/themeResponse';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  activeTheme$: Observable<ThemeResponse> | null = null;


  startNewThemeChallenges(theme: ThemeRequest):  Observable<ThemeResponse> {
    return this.http.post<ThemeResponse>(this.baseUrl + 'theme/add-theme', theme);
  }

  getActiveTheme(): Observable<ThemeResponse> {
    if (!this.activeTheme$) {
      return this.activeTheme$ = this.http.get<ThemeResponse>(`${this.baseUrl}theme/get-active-theme`).pipe(
        shareReplay(1)
      )
    }
    return this.activeTheme$
  }


  clearCache() {
    this.activeTheme$ = null;
  }
}

