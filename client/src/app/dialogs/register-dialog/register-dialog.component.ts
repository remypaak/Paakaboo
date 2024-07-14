import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { map, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss',
})
export class RegisterDialogComponent implements OnInit {
  public accountService = inject(AccountService);
  public dialogRef = inject(MatDialogRef<RegisterDialogComponent>);
  private formBuilderService = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initializeForm();
  }

  register() {
    const register = this.registerForm.value;
    const user: User = {
      userName: register.username,
      password: register.password,
    };
    this.accountService.register(user).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error during registration', error);
      },
    });
  }

  initializeForm() {
    this.registerForm = this.formBuilderService.group({
      username: ['', Validators.required, [this.usernameValidator()]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.requireNonAlphanumeric(),
          this.requireCapitalLetter(),
          this.requireNumber()
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  requireNonAlphanumeric(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value;
      const nonAlphanumericRegex = /[^\w]/;
      if (nonAlphanumericRegex.test(value)) {
        return null;
      } else {
        return { requireNonAlphanumeric: true };
      }
    };
  }

  requireNumber(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (/\d/.test(value)) {
        return null;
      } else {
        return { requireNumber: true };
      }
    };
  }

  requireCapitalLetter(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (/[A-Z]/.test(value)) {
        return null;
      } else {
        return { requireCapitalLetter: true };
      }
    };
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return timer(500).pipe(
        switchMap(() => this.accountService.checkUsername(control.value)),
        map(isTaken => (isTaken ? { usernameTaken: true } : null))
      );
    };
  }
}
