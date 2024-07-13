import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../dialogs/register-dialog/register-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  public dialog = inject(MatDialog);
  public accountService = inject(AccountService);
  private formBuilderService = inject(FormBuilder);
  loginForm: FormGroup = new FormGroup({});
  public errorMessage?: string;

  public ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm() {
    this.loginForm = this.formBuilderService.group({
      username: [''],
      password: [''],
    });
  }

  public login(){
    const user: User = this.loginForm.value
    console.log(user)
    this.accountService.login(user).subscribe( {
        next: () => {
            this.errorMessage = ''
        },
        error: (error) => {
            this.errorMessage = error.error;
            this.hideErrorMessageAfterDelay(3000);
        }
    })

  }

  public logout() {
    this.accountService.logout();
  }

  private hideErrorMessageAfterDelay(delay: number) {
    setTimeout(() => {
      this.errorMessage = '';
    }, delay);
  }
}
