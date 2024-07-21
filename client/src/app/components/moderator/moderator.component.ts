// manage-roles.component.ts
import { Component, inject } from '@angular/core';
import { AddNewChallengeComponent } from "./add-new-challenge/add-new-challenge.component";
import { AddModeratorComponent } from "./add-moderator/add-moderator.component";
import { ThemeService } from '../../_services/theme.service';

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [AddNewChallengeComponent, AddModeratorComponent],
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent{
    public themeService = inject(ThemeService);
    
    ngOnInit(): void {
        if (!this.themeService.activeTheme()){
            this.getActiveTheme()
        }
    }

    getActiveTheme(){
        this.themeService.getActiveTheme()
    }
}