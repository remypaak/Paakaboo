import { Routes, ExtraOptions } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModeratorComponent } from './components/moderator/moderator.component';
import { moderatorGuard } from './_guards/moderator.guard';
import { CurrentChallengeComponent } from './components/challenges/current-challenge/current-challenge.component';
import { TestComponent } from './components/test/test.component';
import { PastChallengesComponent } from './components/challenges/past-challenges/past-challenges.component';
import { PastChallengeDetailsComponent } from './components/challenges/past-challenges/past-challenge-details/past-challenge-details.component';
import { RankingComponent } from './components/ranking/ranking.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'moderator', component: ModeratorComponent,canActivate: [moderatorGuard]},
    {path: 'current-challenge', component: CurrentChallengeComponent},
    {path: 'past-challenges', component: PastChallengesComponent},
    {path: 'past-challenge-details/:id', component: PastChallengeDetailsComponent},
    {path: 'test', component: TestComponent},
    {path: 'ranking', component: RankingComponent},
];
