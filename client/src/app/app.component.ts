import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "../app/components/nav/nav.component";
import { AccountService } from './_services/account.service';
import {NgxSpinnerModule } from 'ngx-spinner';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, NavComponent, NgxSpinnerModule]
})
export class AppComponent implements OnInit{
  private accountService = inject(AccountService);  

  ngOnInit(): void {
    this.setCurrentUser();

  }

  setCurrentUser(): void{
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}