import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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
  activeTheme = signal<ThemeResponse | null>(null)

  activeTheme$: Observable<ThemeResponse> | null = null;


  startNewThemeChallenges(photo: File,theme: ThemeRequest):  Observable<ThemeResponse> {
    const formData = new FormData();
        formData.append('file', photo)
        formData.append('name', theme.name)
        formData.append('weekNumber', theme.weekNumber)
        formData.append('startDate', theme.startDate.toISOString())
        formData.append('submitEndDate', theme.submitEndDate.toISOString())
        formData.append('voteEndDate', theme.voteEndDate.toISOString())
    return this.http.post<ThemeResponse>(this.baseUrl + 'theme/add-theme', formData);
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

