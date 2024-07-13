import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../dialogs/register-dialog/register-dialog.component';
import { CountdownTimerService } from '../_services/countdown.service';
import { HowToInstructionComponent } from "./how-to-instruction/how-to-instruction.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HowToInstructionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
    public timeLeftService = inject(CountdownTimerService)
    public dialog = inject(MatDialog);

    ngOnInit(): void {
        this.timeLeftService.getTimeLeft().subscribe()
    }

    openRegisterDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '1000px';
        dialogConfig.height = '350px';
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-dialog-container';
    
        this.dialog.open(RegisterDialogComponent, dialogConfig);
      }
}
