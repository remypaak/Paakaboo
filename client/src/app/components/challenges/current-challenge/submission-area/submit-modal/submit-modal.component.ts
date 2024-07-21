import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { TimerComponent } from '../../../../../common/timer/timer.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { PhotoService } from '../../../../../_services/photo.service';
import { ThemeService } from '../../../../../_services/theme.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ThemeResponse } from '../../../../../_models/themeResponse';

@Component({
  selector: 'app-submit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TimerComponent,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    
  ],
  templateUrl: './submit-modal.component.html',
  styleUrl: './submit-modal.component.scss',
})
export class SubmitModalComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef = new ElementRef({});
  private formBuilderService = inject(FormBuilder);
  private photoService = inject(PhotoService);
  private themeService = inject(ThemeService);

  private destroy$ = new Subject<void>();
  private activeTheme$ = this.themeService.getActiveTheme()

  clickCloseModal = output();
  submitPhoto = output<ThemeResponse>();
  titleForm: FormGroup = new FormGroup({});
  isModalOpen = false;
  uploadedImage: string | null = null;
  imageTitle: string = '';
  selectedFile: File | null = null;
  isSubmitting = false;
  

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.titleForm = this.formBuilderService.group({
      title: ['', Validators.required],
    });
  }
  openModal() {
    this.isModalOpen = true;
    this.selectedFile = null;
    this.uploadedImage = null;
  }

  closeModal() {
    this.clickCloseModal.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.addDragOverClass();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.removeDragOverClass();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.removeDragOverClass();

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList) {
    const file = files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveImage() {
    if (this.titleForm.valid && this.selectedFile && !this.isSubmitting) {
      this.isSubmitting = true;
      const title = this.titleForm.get('title')?.value;
      this.activeTheme$
      .pipe(
        switchMap(theme =>
          this.photoService.submitPhoto(this.selectedFile!, title, theme.name).pipe(
            switchMap(() => this.activeTheme$)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (theme) => {
         if (theme){
            this.submitPhoto.emit(theme);
         }
          this.clickCloseModal.emit();
          this.isSubmitting = false;
        }
      });
    }
    ;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.themeService.clearCache();
  }

  private addDragOverClass() {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      dropZone.classList.add('dragover');
    }
  }

  private removeDragOverClass() {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      dropZone.classList.remove('dragover');
    }
  }
}
