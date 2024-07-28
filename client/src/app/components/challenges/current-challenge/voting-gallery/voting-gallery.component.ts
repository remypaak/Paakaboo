import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from '../../../../_services/theme.service';
import { PhotoService } from '../../../../_services/photo.service';
import { switchMap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { PhotoWithVotes } from '../../../../_models/photoWithVotes';
import { VoteService } from '../../../../_services/vote.service';
import { ToastrService } from 'ngx-toastr';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { Photo } from '../../../../_models/photo';

@Component({
  selector: 'app-voting-gallery',
  standalone: true,
  imports: [AsyncPipe, ImageModalComponent, NgClass],
  templateUrl: './voting-gallery.component.html',
  styleUrl: './voting-gallery.component.scss',
})
export class VotingGalleryComponent implements OnInit {
  private themeService = inject(ThemeService);
  public photoService = inject(PhotoService);
  public voteService = inject(VoteService);
  private toastrService = inject(ToastrService);

  photosWithUserVotes = signal<PhotoWithVotes[]>([]);
  photosWithAllVotes = signal<Photo[]>([]);
  duplicatePhotoIds = computed(() => this.getDuplicatePhotoIds());

  selectedImageUrl = signal<string>('');
  selectedImageTitle = signal<string>('');
  selectedPhotoIndex = signal<number>(0);
  modalPhotoList = computed(() => {
    if (this.isVotingPeriodActive()) {
      return this.photosWithUserVotes().map((photo) => ({
        url: photo.url,
        title: photo.title,
      }));
    } else {
      return this.photosWithAllVotes().map((photo) => ({
        url: photo.url,
        title: photo.title,
      }));
    }
  });

  isVotingPeriodActive = computed(() => {
    const activeTheme = this.themeService.activeTheme();
    const now = new Date();
    return activeTheme && now <= new Date(activeTheme.voteEndDate);
  });

  ngOnInit(): void {
    if (this.isVotingPeriodActive()) {
      this.getPhotosWithUserVotes();
    } else {
      this.getPhotosWithAllVotes();
    }
  }

  getPhotosWithUserVotes() {
    const activeTheme = this.themeService.activeTheme();
    if (activeTheme) {
      this.photoService.getPhotosWithVotes(activeTheme.id).subscribe({
        next: (photosWithVotes) => {
          const sortedPhotos = photosWithVotes.sort(
            (a, b) => b.points - a.points
          );
          this.photosWithUserVotes.set(sortedPhotos);
        },
      });
    }
  }

  getPhotosWithAllVotes() {
    const activeTheme = this.themeService.activeTheme();
    if (activeTheme) {
      this.photoService.getAllPhotosForActiveTheme(activeTheme.id).subscribe({
        next: (photosWithAllVotes) => {
          const sortedPhotos = photosWithAllVotes.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          this.photosWithAllVotes.set(sortedPhotos);
        },
      });
    }
  }

  votePhoto(photoId: number, vote: number) {
    const updatedPhotos = this.photosWithUserVotes().map((photo) =>
      photo.id === photoId
        ? { ...photo, points: photo.points === vote ? 0 : vote }
        : photo
    );
    this.photosWithUserVotes.set(updatedPhotos);
  }

  submitScores() {
    const votes = this.photosWithUserVotes().map((photo) => ({
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
    const scores = this.photosWithUserVotes()
      .map((photo) => photo.points)
      .filter((points) => points !== 0);
    return new Set(scores).size !== scores.length;
  }

  getDuplicatePhotoIds(): number[] {
    const scores = this.photosWithUserVotes().map((photo) => photo.points);
    const duplicates = scores.filter(
      (score, index, array) => array.indexOf(score) !== index
    );
    return this.photosWithUserVotes()
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

  getTopPhotos(photos: Photo[]) {
    const sortedPhotos = photos.sort((a, b) => b.totalScore - a.totalScore);
    const topPhotos: { gold: Photo[]; silver: Photo[]; bronze: Photo[] } = {
      gold: [],
      silver: [],
      bronze: [],
    };
    if (sortedPhotos.length > 0) {
      topPhotos['gold'].push(sortedPhotos[0]);
      for (let i = 1; i < sortedPhotos.length; i++) {
        if (sortedPhotos[i].totalScore === topPhotos['gold'][0].totalScore) {
          topPhotos['gold'].push(sortedPhotos[i]);
        } else {
            if (topPhotos['gold'].length >= 3) {
                return topPhotos;
            }
          break;
        }
      }

      if (topPhotos['gold'].length === 2 && sortedPhotos.length > 2) {
        topPhotos['bronze'].push(sortedPhotos[2]);
        for (let i = 3; i < sortedPhotos.length; i++) {
          if (
            sortedPhotos[i].totalScore === topPhotos['bronze'][0].totalScore
          ) {
            topPhotos['bronze'].push(sortedPhotos[i]);
          } else {
            return topPhotos;
          }
        }
      } else if (topPhotos['gold'].length === 1 && sortedPhotos.length > 1) {
        topPhotos['silver'].push(sortedPhotos[1]);
        for (let i = 2; i < sortedPhotos.length; i++) {
          if (
            sortedPhotos[i].totalScore === topPhotos['silver'][0].totalScore
          ) {
            topPhotos['silver'].push(sortedPhotos[i]);
          } else {
                if (topPhotos['silver'].length >= 2) {
                return topPhotos;
                }
            break;
          }
        }
      }
      if (topPhotos['gold'].length === 1 && topPhotos['silver'].length === 1 && sortedPhotos.length > 2){
        topPhotos['bronze'].push(sortedPhotos[2])
        for (let i = 3; i < sortedPhotos.length; i++){
            if(sortedPhotos[i].totalScore === topPhotos['bronze'][0].totalScore){
                topPhotos['bronze'].push(sortedPhotos[i])
            }else{
                return topPhotos;
            }
        }
      }
    }
    return topPhotos;
  }

  getBorderClass(photo: Photo, topPhotos: { [key: string]: Photo[] }): string {
    if (topPhotos['gold'].includes(photo)) {
      return 'gold-border';
    } else if (topPhotos['silver'].includes(photo)) {
      return 'silver-border';
    } else if (topPhotos['bronze'].includes(photo)) {
      return 'bronze-border';
    }
    return '';
  }
}
