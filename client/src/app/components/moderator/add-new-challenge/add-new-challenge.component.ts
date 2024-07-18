import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { ThemeService } from '../../../_services/theme.service';
import { ToastrService } from 'ngx-toastr';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-new-challenge',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'nl-NL' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
  templateUrl: './add-new-challenge.component.html',
  styleUrl: './add-new-challenge.component.scss',
})
export class AddNewChallengeComponent implements OnInit, OnDestroy {
  private formBuilderService = inject(FormBuilder);
  private themeService = inject(ThemeService);
  private toastrService = inject(ToastrService);
  themeForm: FormGroup = new FormGroup({});
  hasActiveTheme: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
    this.setHasActiveTheme();
  }
  initializeForm() {
    this.themeForm = this.formBuilderService.group({
      themeName: ['', Validators.required],
      endDate: ['', [Validators.required, this.endDateValidator()]],
    });
  }

  setHasActiveTheme() {
    this.themeService.getActiveTheme().subscribe({
      next: (response) => {
        if (response != null) {
          this.hasActiveTheme = true;
        }
      },
    });
  }

  onSubmit() {
    if (this.themeForm.valid) {
      const themeName = this.themeForm.get('themeName')?.value;
      const endDate: Date = this.themeForm.get('endDate')?.value;

      const endDateObj = new Date(endDate);
      endDateObj.setHours(endDateObj.getHours() + 16);
      const voteEndDate = new Date(endDateObj);
      voteEndDate.setDate(voteEndDate.getDate() + 1);

      this.themeService
        .startNewThemeChallenges({
          name: themeName,
          startDate: new Date(),
          submitEndDate: endDateObj,
          voteEndDate: voteEndDate,
        })
        .subscribe({
          next: () => {
            this.setHasActiveTheme();
            this.toastrService.success(
              'Het thema voor de volgende challenge is aangemaakt!'
            );
            this.initializeForm();
          },
        });
    }
  }

  private endDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const currentDate = new Date();
      const endDate = new Date(control.value);
      console.log(currentDate, endDate);

      if (endDate <= currentDate) {
        return { endDateInvalid: true };
      }

      return null;
    };
  }

  ngOnDestroy(): void {
    this.themeService.clearCache();
  }
}
