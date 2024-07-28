import { Component, inject } from '@angular/core';
import { ThemeService } from '../../_services/theme.service';
import { TestService } from '../../_services/test.service';
import { ToastrService } from 'ngx-toastr';
import { ModeratorService } from '../../_services/moderator.service';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  testService = inject(TestService);
  moderatorService = inject(ModeratorService);
  accountService = inject(AccountService);
  toastrService = inject(ToastrService);

  endCurrentSubmitPeriod() {
    this.testService.endCurrentSubmitPeriod().subscribe({
      next: (response) => {
        if (response.message === 'There is no active theme') {
          this.toastrService.error('Er is nog geen actief thema');
        } else {
          this.toastrService.success('Inzend periode beëindigd');
        }
      },
    });
  }

  endCurrentVotePeriod() {
    this.testService.endCurrentVotePeriod().subscribe({
      next: (response) => {
        if (response.message === 'There is no active theme') {
          this.toastrService.error('Er is nog geen actief thema');
        } else if (
          response.message ===
          'Cannot end the vote period as the submit period is not yet over'
        ) {
          this.toastrService.error(
            'De stemmingsperiode kan niet beëindigd worden als de inzendperiode nog loopt'
          );
        } else {
          this.toastrService.success('Stemming periode beëindigd');
        }
      },
    });
  }

  endCurrentChallenge() {
    this.testService.endChallenge().subscribe({
      next: (response) => {
        if (response.message === 'There is no active theme') {
          this.toastrService.error('Er is nog geen actief thema');
        } else if (
          response.message ===
          'Cannot end the vote period as the submit period is not yet over'
        ) {
          this.toastrService.error(
            'De stemmingsperiode kan niet beëindigd worden als de inzendperiode nog loopt'
          );
        } else {
          this.toastrService.success('De challenge is beëindigd');
        }
      },
    });
  }

  generateSubmissions() {
    this.testService.generateSubmissions().subscribe({
      next: (response) => {
        if (response.message === 'There is no active theme') {
          this.toastrService.error('Er is nog geen actief thema');
        } else if (
          response.message ===
          'Cannot generate submissions after submissionperiod ended'
        ) {
          this.toastrService.error(
            'Inzendingen kunnen niet gegenereerd worden als de inzendperiode al is verstreken'
          );
        } else {
          this.toastrService.success(
            'Inzendingen zijn gegenereerd voor het huidige thema'
          );
        }
      },
    });
  }

  generateVotes() {
    this.testService.generateVotes().subscribe({
      next: (response) => {
        if (response.message === 'There is no active theme') {
          this.toastrService.error('Er is nog geen actief thema');
        } else if (
          response.message ===
          'Cannot generate votes before the submission period is over'
        ) {
          this.toastrService.error(
            'Kan geen inzendingen genereren als de inzendperiode nog niet over is'
          );
        } else {
          this.toastrService.success('Stemmen zijn gegenereerd');
        }
      },
    });
  }

  assignModerator() {
    const currentUser = this.accountService.currentUser();
    console.log(currentUser);
    if (currentUser) {
      this.moderatorService
        .assignRole(currentUser.userName, 'Moderator')
        .subscribe({
          next: () => {
            this.toastrService.success('Jij bent nu een moderator!');
          },
          error: (error) => {
            if (error.error.message === 'User already has the role') {
              this.toastrService.error('Je bent al een moderator');
            }
          },
        });
    }
  }
}
