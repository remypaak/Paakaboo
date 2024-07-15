import { Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TimerComponent } from '../../home/right-side/timer/timer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { PhotoService } from '../../_services/photo.service';

@Component({
  selector: 'app-current-challenge',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TimerComponent,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './current-challenge.component.html',
  styleUrl: './current-challenge.component.scss',
})
export class CurrentChallengeComponent implements OnInit{
  @ViewChild('fileInput') fileInput: ElementRef = new ElementRef({});
  private formBuilderService = inject(FormBuilder);
  private photoService = inject(PhotoService);
  titleForm: FormGroup = new FormGroup({});
  isModalOpen = false;
  uploadedImage: string | null = null;
  imageTitle: string = '';
  selectedFile: File | null = null;


  ngOnInit(): void {
      this.initializeForm()
  }
  initializeForm(){
    this.titleForm = this.formBuilderService.group({
        title: ['', Validators.required]
      });
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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
    console.log('File:', files[0]);
    this.selectedFile = file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveImage() {
    if (this.titleForm.valid && this.selectedFile){
        const title = this.titleForm.get('imageTitle')?.value;
        this.photoService.submitPhoto(this.selectedFile, title).subscribe(
            response => {
              console.log('Photo submitted successfully', response);
              // Handle successful submission (e.g., close modal, show a success message)
            })
    }
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
