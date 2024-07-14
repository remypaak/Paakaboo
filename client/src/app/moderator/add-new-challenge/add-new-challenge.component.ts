import { Component, inject, OnInit } from '@angular/core';
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
  MAT_NATIVE_DATE_FORMATS,
  MatDateFormats,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { ThemeService } from '../../_services/theme.service';
import { ToastrService } from 'ngx-toastr';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-new-challenge',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
  ],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './add-new-challenge.component.html',
  styleUrl: './add-new-challenge.component.scss',
})
export class AddNewChallengeComponent implements OnInit {
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
    this.themeService.hasActiveTheme().subscribe({
      next: (response) => {
        this.hasActiveTheme = response.hasActiveTheme;
      },
    });
  }

  onSubmit() {
    if (this.themeForm.valid) {
      const themeName = this.themeForm.get('themeName')?.value;
      const endDate = this.themeForm.get('endDate')?.value;
      this.themeService
        .startedNewThemeChallenges({
          name: themeName,
          endDate: endDate,
        })
        .subscribe({
          next: () => {
            this.setHasActiveTheme();
            this.toastrService.success("Het thema voor de volgende challenge is aangemaakt!")
            this.initializeForm()
          },
        });
    }
  }

  private endDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const currentDate = new Date();
      const endDate = new Date(control.value);
      currentDate.setHours(0,0,0,0);
  
      if (endDate < currentDate) {
        return { endDateInvalid: true };
      }
  
      return null;
    };
  }
}
