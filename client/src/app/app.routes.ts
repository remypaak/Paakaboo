import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { moderatorGuard } from './_guards/moderator.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'moderator', component: ModeratorComponent, canActivate: [moderatorGuard]}
];
