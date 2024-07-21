import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeroComponent } from '../hero/hero.component';
import { HowToInstructionComponent } from '../how-to-instruction/how-to-instruction.component';

import { RegisterDialogComponent } from '../../dialogs/register-dialog/register-dialog.component';
import { TimerComponent } from '../../../common/timer/timer.component';
import { ThemeService } from '../../../_services/theme.service';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [HowToInstructionComponent, HeroComponent, TimerComponent, AsyncPipe],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss'
})
export class RightSideComponent {
    public themeService = inject(ThemeService);
    public dialog = inject(MatDialog);
    activeTheme$ = this.themeService.getActiveTheme()
    

    openRegisterDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '70rem';
        dialogConfig.height = '30rem';
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-dialog-container';
    
        this.dialog.open(RegisterDialogComponent, dialogConfig);
      }
}
