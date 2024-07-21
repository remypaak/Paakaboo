import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../forms/text-input/text-input.component';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { RouterLink } from '@angular/router';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhotoService } from '../../_services/photo.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, RouterLink, HasRoleDirective,MatFormFieldModule, MatInputModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  public dialog = inject(MatDialog);
  public accountService = inject(AccountService);
  private formBuilderService = inject(FormBuilder);
  private photoService = inject(PhotoService);
  private toastrService = inject(ToastrService);
  loginForm: FormGroup = new FormGroup({});
  public errorMessage?: string;

  public ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm() {
    this.loginForm = this.formBuilderService.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public login(){
    const user: User = this.loginForm.value
    this.accountService.login(user).subscribe( {
        next: () => {
            this.errorMessage = ''
        },
        error: (error) => {
            this.toastrService.error(error.error);
        }
    })

  }

  public logout() {
    this.photoService.submittedPhoto.set(null);
    this.accountService.logout();
    this.loginForm.reset();
  }

}
