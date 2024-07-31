import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ThemeRequest } from '../_models/themeRequest';
import { Observable, tap } from 'rxjs';
import { ThemeResponse } from '../_models/themeResponse';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  activeTheme = signal<ThemeResponse | null>(null)


  startNewThemeChallenges(photo: File,theme: ThemeRequest):  Observable<ThemeResponse> {
    const formData = new FormData();
        formData.append('file', photo)
        formData.append('name', theme.name)
        formData.append('weekNumber', theme.weekNumber)
        formData.append('startDate', theme.startDate.toISOString())
        formData.append('submitEndDate', theme.submitEndDate.toISOString())
        formData.append('voteEndDate', theme.voteEndDate.toISOString())
        formData.append('trophyEndDate', theme.trophyEndDate.toISOString())
    return this.http.post<ThemeResponse>(this.baseUrl + 'theme/add-theme', formData).pipe(
        tap((theme) => this.activeTheme.set(theme))
    );
  }

  getActiveTheme(): Observable<ThemeResponse> {
      return this.http.get<ThemeResponse>(`${this.baseUrl}theme/get-active-theme`).pipe(
        tap((theme) => this.activeTheme.set(theme))
      )
  }

  getPastThemes(): Observable<ThemeResponse[]> {
    return this.http.get<ThemeResponse[]>(`${this.baseUrl}theme/get-past-themes`)
  }



}

