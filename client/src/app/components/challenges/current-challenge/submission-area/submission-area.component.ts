import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { TimerComponent } from '../../../../common/timer/timer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SubmitModalComponent } from './submit-modal/submit-modal.component';
import { ThemeService } from '../../../../_services/theme.service';
import { CapitalizeDatePipe } from '../../../../pipe/capitalize-date.pipe';
import { switchMap, tap } from 'rxjs';
import { PhotoService } from '../../../../_services/photo.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-submission-area',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TimerComponent,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    SubmitModalComponent,
    CapitalizeDatePipe,
    AsyncPipe,
    DatePipe,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'nl-NL' }, DatePipe],

  templateUrl: './submission-area.component.html',
  styleUrl: './submission-area.component.scss',
})
export class SubmissionAreaComponent implements OnInit {
  public themeService = inject(ThemeService);
  public photoService = inject(PhotoService);
  public datepipe = inject(DatePipe);
  isLoading = false;

  currentDate: Date = new Date();
  isModalOpen = false;
  datePipe: any;

  ngOnInit(): void {
    if (!this.photoService.submittedPhoto())
    {
        this.isLoading = true;
        console.log(this.photoService.submittedPhoto())
        this.getSubmittedPhoto();
    }
  }

  getActiveTheme() {
    this.themeService
      .getActiveTheme()
      .pipe(
        switchMap((theme) => this.photoService.getPhotoForActiveTheme(theme.name)),
        tap(() => (this.isLoading = false)),
         )
      .subscribe();
  }

  getSubmittedPhoto(){
    const activeTheme = this.themeService.activeTheme()
    if (activeTheme){
        this.photoService.getPhotoForActiveTheme(activeTheme.name).pipe(
            tap(() => { this.isLoading = false})).subscribe()
    }
        

  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
