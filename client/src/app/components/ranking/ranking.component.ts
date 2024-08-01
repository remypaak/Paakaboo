import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RankingService } from '../../_services/ranking.service';
import { Observable } from 'rxjs';
import { Ranking } from '../../_models/ranking';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit, OnDestroy{
    isSmallScreen: boolean = window.innerWidth < 1000;
    rankingService = inject(RankingService);
    ranking = signal<Ranking | null>(null);



    ngOnInit(): void {
        window.addEventListener('resize', this.updateScreenSize);
        this.isSmallScreen = window.innerWidth < 1000;
        this.getRanking();
    }

    getRanking(){
        this.rankingService.getRankings().subscribe({
            next: (ranking) => {
                this.ranking.set(ranking);
            }
        })
    }

    updateScreenSize = () => {
        this.isSmallScreen = window.innerWidth < 1000;
      };

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.updateScreenSize)
    }
}
