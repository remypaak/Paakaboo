import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { RouterLink } from '@angular/router';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhotoService } from '../../_services/photo.service';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HasRoleDirective,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit, OnDestroy {
  public dialog = inject(MatDialog);
  public accountService = inject(AccountService);
  private formBuilderService = inject(FormBuilder);
  private photoService = inject(PhotoService);
  private toastrService = inject(ToastrService);
  private elRef = inject(ElementRef);
  loginForm: FormGroup = new FormGroup({});
  loginSmallSize = false;
  menuOpen = false;
  subscription = new Subscription();

  ngOnInit(): void {
    this.initializeForm();
    this.checkWindowSize();
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const navLinks = document.querySelector('.nav-links');
    const clickedInsideNavLinks = navLinks ? navLinks.contains(targetElement) : false;

    if (this.menuOpen && !clickedInsideNavLinks) {
      this.toggleMenu();
    }
  }

  checkWindowSize() {
    this.loginSmallSize = window.innerWidth < 1000;
  }

  public initializeForm() {
    this.loginForm = this.formBuilderService.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public login() {
    const user: User = this.loginForm.value;
    this.accountService.login(user).subscribe({
      error: (error) => {
        this.toastrService.error(error.error);
      },
    });
  }

  public logout() {
    this.photoService.submittedPhoto.set(null);
    this.accountService.logout();
    this.loginForm.reset();
  }

  toggleMenu(event?: MouseEvent) {
    if (event){
        event.stopPropagation()
    }
    this.menuOpen = !this.menuOpen;
  }

  openLoginModal() {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '300px'
    });

    this.subscription = dialogRef.componentInstance.toggleMenu.subscribe(() => {
        this.toggleMenu();
      });
      
  }


  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
