import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModeratorComponent } from './moderator/moderator/moderator.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'moderator', component: ModeratorComponent}
];
