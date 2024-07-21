import { Component, inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { TimerComponent } from '../../../../common/timer/timer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SubmitModalComponent } from './submit-modal/submit-modal.component';
import { ThemeService } from '../../../../_services/theme.service';
import { CapitalizeDatePipe } from '../../../../pipe/capitalize-date.pipe';
import { distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs';
import { PhotoService } from '../../../../_services/photo.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ThemeResponse } from '../../../../_models/themeResponse';

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
export class SubmissionAreaComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  public photoService = inject(PhotoService);
  public datepipe = inject(DatePipe);
  isLoading = true;

  activeTheme$ = this.themeService
    .getActiveTheme()
    .pipe(distinctUntilChanged((prev, curr) => prev.name === curr.name),);

  photoForActiveTheme$ = this.activeTheme$.pipe(
    switchMap((theme) => this.photoService.getPhotoForActiveTheme(theme.name)),
    tap(() => this.isLoading = false),
    shareReplay(1)
  );

  currentDate: Date = new Date();
  isModalOpen = false;
  datePipe: any;

  ngOnInit(): void {}

  onPhotoSubmit(theme: ThemeResponse) {
    this.photoForActiveTheme$ = this.photoService.getPhotoForActiveTheme(
      theme.name
    );
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    this.themeService.clearCache();
  }
}
