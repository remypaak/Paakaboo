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
import { AsyncPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
    AsyncPipe
    
  ],
  templateUrl: './submit-modal.component.html',
  styleUrl: './submit-modal.component.scss',
})
export class SubmitModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = new ElementRef({});
  private formBuilderService = inject(FormBuilder);
  private photoService = inject(PhotoService);
  public themeService = inject(ThemeService);
  private toastrService = inject(ToastrService);

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

      const activeTheme = this.themeService.activeTheme()
      if (activeTheme){
        this.photoService.submitPhoto(this.selectedFile!, title, activeTheme.name).subscribe({
            next : () => {
                this.toastrService.success("De foto is succesvol ingediend!")
                this.submitPhoto.emit(activeTheme)
                this.clickCloseModal.emit()
                this.isSubmitting = false
            },
            error: () => {
                this.toastrService.error("Er ging iets mis tijdens het indienen van de foto")
            }
        })
      }
    }
    ;
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
