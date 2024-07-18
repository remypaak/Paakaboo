import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeroComponent } from '../hero/hero.component';
import { HowToInstructionComponent } from '../how-to-instruction/how-to-instruction.component';

import { RegisterDialogComponent } from '../../dialogs/register-dialog/register-dialog.component';
import { TimerComponent } from '../../../common/timer/timer.component';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [HowToInstructionComponent, HeroComponent, TimerComponent],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss'
})
export class RightSideComponent {
    
    public dialog = inject(MatDialog);
    

    openRegisterDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '1000px';
        dialogConfig.height = '350px';
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-dialog-container';
    
        this.dialog.open(RegisterDialogComponent, dialogConfig);
      }
}
