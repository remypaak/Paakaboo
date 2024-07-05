import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private http = inject(HttpClient);
    currentUser = signal<User | null>(null);
    baseUrl = environment.apiUrl;
    
    login(model: any): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
            tap(user => {
                if (user){
                    this.currentUser.set(user)
                }
            })
        )
    }

    register(model: any): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
            tap(user => {
                if (user){
                    this.currentUser.set(user)
                }
            })
        )
    }

    setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
      }
}
