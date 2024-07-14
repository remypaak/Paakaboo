import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Theme } from '../_models/theme';
import { HasActiveThemeRequest } from '../_models/has-active-theme-request';
import { ActiveThemeEndDateRequest } from '../_models/active-theme-enddate-request';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
    public http = inject(HttpClient);
    baseurl = environment.apiUrl

    startedNewThemeChallenges(theme: Theme){
        return this.http.post<Theme>(this.baseurl + 'theme/add-theme', theme)
    }

    hasActiveTheme(){
        return this.http.get<HasActiveThemeRequest>(this.baseurl + 'theme/has-active-theme')
    }

    getActiveThemeEndDate(){
        return this.http.get<ActiveThemeEndDateRequest>(this.baseurl + 'theme/active-theme-end-date')
    }
}
