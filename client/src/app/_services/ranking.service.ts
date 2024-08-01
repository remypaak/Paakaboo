import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Ranking } from '../_models/ranking';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
    private http = inject(HttpClient);
    baseUrl = environment.apiUrl;


    getRankings(){
        return this.http.get<Ranking>(this.baseUrl + 'ranking/ranking')
    }
}
