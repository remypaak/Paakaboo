import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private http = inject(HttpClient);
    currentUser = signal<User | null>(null);
    roles = computed(() => {
        const user = this.currentUser();
        if (user && user.token){
            const role = JSON.parse(atob(user.token.split('.')[1])).role
            return Array.isArray(role) ? role : [role];
        }
        return [];
      })
    baseUrl = environment.apiUrl;
    
    login(user: User): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'account/login', user).pipe(
            tap(user => {
                if (user){
                    this.setCurrentUser(user)
                }
            })
        )
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'account/register', user).pipe(
            tap(user => {
                if (user){
                    this.setCurrentUser(user)
                }
            })
        )
    }

    checkUsername(username: string)
    {
        return this.http.get<boolean>(this.baseUrl + 'account/is-username-taken/'+ username)
    }

    logout(){
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        console.log(this.roles())
      }

    
}
