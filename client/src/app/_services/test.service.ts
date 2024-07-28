import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {
    private http = inject(HttpClient);
    baseUrl = environment.apiUrl;

    endCurrentSubmitPeriod(){
        return this.http.post<{message: string}>(this.baseUrl + 'test/end-submit-period', {})
    }

    endCurrentVotePeriod(){
        return this.http.post<{message: string}>(this.baseUrl + 'test/end-vote-period', {})
    }

    generateSubmissions(){
        return this.http.post<{message: string}>(this.baseUrl + 'test/generate-submissions', {})
    }

    generateVotes(){
        return this.http.post<{message: string}>(this.baseUrl + 'test/generate-votes', {})
    }

    endChallenge(){
        return this.http.post<{message: string}>(this.baseUrl + 'test/end-challenge', {})
    }

}
