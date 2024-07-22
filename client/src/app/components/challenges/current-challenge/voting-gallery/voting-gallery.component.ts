import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from '../../../../_services/theme.service';
import { PhotoService } from '../../../../_services/photo.service';
import {  switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PhotoWithVotes } from '../../../../_models/photoWithVotes';
import { VoteService } from '../../../../_services/vote.service';
import { ToastrService } from 'ngx-toastr';
import { ImageModalComponent } from "./image-modal/image-modal.component";

@Component({
  selector: 'app-voting-gallery',
  standalone: true,
  imports: [AsyncPipe, ImageModalComponent],
  templateUrl: './voting-gallery.component.html',
  styleUrl: './voting-gallery.component.scss',
})
export class VotingGalleryComponent implements OnInit {
  private themeService = inject(ThemeService);
  public photoService = inject(PhotoService);
  public voteService = inject(VoteService);
  private toastrService = inject(ToastrService);

  activeTheme$ = this.themeService.getActiveTheme();
  photosWithVotes = signal<PhotoWithVotes[]>([]);
  duplicatePhotoIds = computed(() => this.getDuplicatePhotoIds());

  selectedImageUrl = signal<string>('');
  selectedImageTitle = signal<string>('');
  selectedPhotoIndex = signal<number>(0);
  modalPhotoList = computed(() => this.photosWithVotes().map(photo => ({ url: photo.url, title: photo.title })));


  ngOnInit(): void {
    this.getPhotosWithVotes()
  }

  getPhotosWithVotes(){
    const activeTheme = this.themeService.activeTheme()
    if (activeTheme){
        this.photoService.getPhotosWithVotes(activeTheme.id).subscribe({
            next: (photosWithVotes) => this.photosWithVotes.set(photosWithVotes)
        });
    }
  }
  votePhoto(photoId: number, vote: number) {
    const updatedPhotos = this.photosWithVotes().map((photo) =>
      photo.id === photoId ? { ...photo, points: photo.points === vote ? 0 : vote } : photo
    );
    this.photosWithVotes.set(updatedPhotos);
  }

  submitScores() {
    const votes = this.photosWithVotes().map((photo) => ({
      photoId: photo.id,
      points: photo.points || 0,
    }));
    this.voteService.submitVotes(votes).subscribe({
      next: () => {
        this.toastrService.success('Jouw stemmen zijn correct verwerkt!');
      },
      error: () => {
        this.toastrService.error(
          'Er ging iets mis tijdens het verwerken van de stemmen'
        );
      },
    });
  }

  hasDuplicateScores(): boolean {
    const scores = this.photosWithVotes().map((photo) => photo.points).filter(points => points !== 0);
    return new Set(scores).size !== scores.length;
  }

  getDuplicatePhotoIds(): number[] {
    const scores = this.photosWithVotes().map((photo) => photo.points);
    const duplicates = scores.filter(
      (score, index, array) => array.indexOf(score) !== index
    );
    return this.photosWithVotes()
      .filter(
        (photo) => duplicates.includes(photo.points) && photo.points !== 0
      )
      .map((photo) => photo.id);
  }

  openImageModal(imageUrl: string, imageTitle: string, index: number) {
    this.selectedImageUrl.set(imageUrl);
    this.selectedImageTitle.set(imageTitle);
    this.selectedPhotoIndex.set(index);
  }

  closeModal() {
    this.selectedImageUrl.set('');
    this.selectedImageTitle.set('');
  }
}

  
