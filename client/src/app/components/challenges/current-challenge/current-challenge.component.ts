import { Component } from '@angular/core';
import { SubmissionAreaComponent } from './submission-area/submission-area.component';
import { VotingGalleryComponent } from "./voting-gallery/voting-gallery.component";

@Component({
  selector: 'app-current-challenge',
  standalone: true,
  imports: [SubmissionAreaComponent, VotingGalleryComponent],
  templateUrl: './current-challenge.component.html',
  styleUrl: './current-challenge.component.scss'
})
export class CurrentChallengeComponent {

}
