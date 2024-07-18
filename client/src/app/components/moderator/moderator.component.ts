// manage-roles.component.ts
import { Component } from '@angular/core';
import { AddNewChallengeComponent } from "./add-new-challenge/add-new-challenge.component";
import { AddModeratorComponent } from "./add-moderator/add-moderator.component";

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [AddNewChallengeComponent, AddModeratorComponent],
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent{
}