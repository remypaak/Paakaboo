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
  styleUrls: ['./add-new-challenge.component.scss'],
})
export class AddNewChallengeComponent implements OnInit {
  private formBuilderService = inject(FormBuilder);
  private themeService = inject(ThemeService);
  private toastrService = inject(ToastrService);
  themeForm: FormGroup = new FormGroup({});
  hasActiveTheme: boolean = false;
  uploadedImage: string | null = null;
  showImageError: boolean = false;
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.setHasActiveTheme();
  }

  initializeForm() {
    this.themeForm = this.formBuilderService.group({
      themeName: ['', Validators.required],
      endDate: ['', [Validators.required, this.endDateValidator()]],
      weekNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      imageControl: [null, Validators.required],
    });
  }

  setHasActiveTheme() {
    this.hasActiveTheme = !!this.themeService.activeTheme() 
  }

  onSubmit() {
    if (this.themeForm.valid && this.selectedFile) {
      const themeName = this.themeForm.get('themeName')?.value;
      const endDate: Date = this.themeForm.get('endDate')?.value;
      const weekNumber = this.themeForm.get('weekNumber')?.value;

      const endDateObj = new Date(endDate);
      endDateObj.setHours(endDateObj.getHours() + 16);
      const voteEndDate = new Date(endDateObj);
      voteEndDate.setDate(voteEndDate.getDate() + 1);
      voteEndDate.setHours(voteEndDate.getHours() - 6);
      const trophyEndDate = new Date(voteEndDate);
      trophyEndDate.setHours(trophyEndDate.getHours() + 12);

      this.themeService
        .startNewThemeChallenges(this.selectedFile, {
          name: themeName,
          weekNumber: weekNumber,
          startDate: new Date(),
          submitEndDate: endDateObj,
          voteEndDate: voteEndDate,
          trophyEndDate: trophyEndDate
        })
        .subscribe({
          next: () => {
            this.hasActiveTheme = true;
            this.toastrService.success(
              'Het thema voor de volgende challenge is aangemaakt!'
            );
            this.initializeForm();
            this.uploadedImage = null;
            this.showImageError = false;
          },
        });
    }
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        this.selectedFile = input.files[0]
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
      this.themeForm.patchValue({ imageControl: input.files[0] });
      this.themeForm.get('imageControl')?.updateValueAndValidity();
    }
  }

  private endDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const currentDate = new Date();
      const endDate = new Date(control.value);

      if (endDate <= currentDate) {
        return { endDateInvalid: true };
      }

      return null;
    };
  }

  onSubmitButtonHover() {
    if (
      this.themeForm.get('weekNumber')?.valid &&
      this.themeForm.get('endDate')?.valid &&
      this.themeForm.get('themeName')?.valid
    ) {
      this.showImageError = true;
    }
  }
}
