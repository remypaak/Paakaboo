import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeResponse } from '../../../../_models/themeResponse';
import { ThemeService } from '../../../../_services/theme.service';
import { PhotoService } from '../../../../_services/photo.service';
import { Observable } from 'rxjs';
import { Photo } from '../../../../_models/photo';
import { AsyncPipe, NgClass } from '@angular/common';
import { ImageModalComponent } from "../../current-challenge/voting-gallery/image-modal/image-modal.component";
import { Vote } from '../../../../_models/vote';
import { VoteService } from '../../../../_services/vote.service';
import { VotesDetailsComponent } from "../../../../common/votes-details/votes-details.component";

@Component({
  selector: 'app-past-challenge-details',
  standalone: true,
  imports: [AsyncPipe, ImageModalComponent, NgClass, VotesDetailsComponent],
  templateUrl: './past-challenge-details.component.html',
  styleUrl: './past-challenge-details.component.scss',
})
export class PastChallengeDetailsComponent implements OnInit {
  router = inject(Router);
  photoService = inject(PhotoService);
  voteService = inject(VoteService)
  theme?: ThemeResponse;
  photos = signal<Photo[]>([]);
  selectedImageUrl = signal<string>('');
  selectedImageTitle = signal<string>('');
  selectedPhotoIndex = signal<number>(0);
  modalPhotoList = computed(() => {
      return this.photos().map((photo) => ({
        url: photo.url,
        title: photo.title,
      }));
    
  });

  votes: Vote[] = [];
  isVotesModalOpen = false;

  ngOnInit(): void {
    this.theme = history.state.theme;
    if (this.theme) {
      this.photoService.getAllPhotosForTheme(this.theme?.id).subscribe({
        next: (photos) => {
            const sortedPhotos = photos.sort(
                (a, b) => b.totalScore - a.totalScore
              );
              this.photos.set(sortedPhotos);
        }
      });
    }
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

  openVotesModal(photoId: number): void {
    this.voteService.GetVotesForPhoto(photoId).subscribe(votes => {
        this.votes = votes.sort((a, b) => b.points - a.points);
      this.isVotesModalOpen = true;
      console.log(this.isVotesModalOpen)
    });
  }

  closeVotesModal(): void {
    this.isVotesModalOpen = false;
  }
}
