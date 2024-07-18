import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../_services/theme.service';
import { PhotoService } from '../../../../_services/photo.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-voting-gallery',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './voting-gallery.component.html',
  styleUrl: './voting-gallery.component.scss'
})
export class VotingGalleryComponent {
    private themeService = inject(ThemeService);
  public photoService = inject(PhotoService);
    photos = [
        { imagePath: 'path_to_image1.jpg', title: 'Photo Title 1' },
        { imagePath: 'path_to_image2.jpg', title: 'Photo Title 2' },
        // Add more photos as needed
      ];

      activeTheme$ = this.themeService.getActiveTheme();
      allPhotosFromTheme$ = this.activeTheme$.pipe(
        switchMap(theme => this.photoService.getAllPhotosForActiveTheme(theme.name)));

        submitScores(){
            
        }
}
