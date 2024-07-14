import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {
    public http = inject(HttpClient);
    baseUrl = environment.apiUrl;
    public usersWithoutModeratorRole = signal<User[]>([]);

    public getUsersWithoutModeratorRole() : Observable<User[]>{
        return this.http.get<{userName: string}[]>(this.baseUrl + 'admin/non-moderators').pipe(
            tap(moderators => {
                this.usersWithoutModeratorRole.set(moderators);
            })
        )
    }

    public assignRole(username: string, role: string) : Observable<void>{
        return this.http.post<any>(this.baseUrl + 'admin/assign-role', {username, role})
    }


  
}
