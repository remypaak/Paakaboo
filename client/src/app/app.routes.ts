import { Routes, ExtraOptions } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModeratorComponent } from './components/moderator/moderator.component';
import { moderatorGuard } from './_guards/moderator.guard';
import { CurrentChallengeComponent } from './components/challenges/current-challenge/current-challenge.component';
import { TestComponent } from './components/test/test.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'moderator', component: ModeratorComponent,canActivate: [moderatorGuard]},
    {path: 'challenges', component: CurrentChallengeComponent},
    {path: 'test', component: TestComponent}
];
