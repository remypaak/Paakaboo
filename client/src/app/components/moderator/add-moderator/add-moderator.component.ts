// manage-roles.component.ts
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModeratorService } from '../../../_services/moderator.service';
import { AddNewChallengeComponent } from '../add-new-challenge/add-new-challenge.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-moderator',
  standalone: true,
  imports: [ReactiveFormsModule, AddNewChallengeComponent],
  templateUrl: './add-moderator.component.html',
  styleUrls: ['./add-moderator.component.scss'],
})
export class AddModeratorComponent implements OnInit {
  public moderatorService = inject(ModeratorService);
  private formBuilderService = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  assignRoleForm: FormGroup = new FormGroup({});

  selectedUser: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.moderatorService.getUsersWithoutModeratorRole().subscribe();
  }

  initializeForm() {
    this.assignRoleForm = this.formBuilderService.group({
      username: ['', Validators.required],
    });
  }

  assignRole() {
    if (this.selectedUser) {
      this.moderatorService
        .assignRole(this.selectedUser, 'Moderator')
        .subscribe({
          next: () => {
            this.assignRoleForm.reset();
            this.toastrService.success(`${this.selectedUser} is nu officieel een moderator!`)
            this.ngOnInit();
          },
        });
    }
  }
}
