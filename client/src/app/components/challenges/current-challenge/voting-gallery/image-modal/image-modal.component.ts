import { Component, Input, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  @Input() imageUrl: string = '';
  @Input() imageTitle: string = '';
  @Input() photoList: { url: string, title: string }[] = [];
  @Input() currentIndex: number = 0;
 closeModalEvent = output();

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.imageUrl = '';
    this.imageTitle = '';
    this.closeModalEvent.emit()
  }

  previousImage(event: Event) {
    event.stopPropagation();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.photoList.length - 1;
    }
    this.updateImage();
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.currentIndex < this.photoList.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateImage();
  }

  updateImage() {
    const currentPhoto = this.photoList[this.currentIndex];
    this.imageUrl = currentPhoto.url;
    this.imageTitle = currentPhoto.title;
  }
}