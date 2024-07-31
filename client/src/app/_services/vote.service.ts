import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vote } from '../_models/vote';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
    private http = inject(HttpClient);
    baseUrl = environment.apiUrl;

    submitVotes(votes: Vote[])
    {
        return this.http.post<Vote[]>(this.baseUrl + 'vote/submit-votes', votes)
    }

    GetVotesForPhoto(photoId: number){
        return this.http.get<Vote[]>(this.baseUrl + 'vote/' + photoId + '/votes')
    }
}
