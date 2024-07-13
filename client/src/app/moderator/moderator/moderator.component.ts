import { Component } from '@angular/core';
import { User } from '../../_models/user';

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [],
  templateUrl: './moderator.component.html',
  styleUrl: './moderator.component.scss'
})
export class ModeratorComponent {
    // users: User[] = [];
    // selectedUserId: string | null = null;
  
    // constructor(private userService: UserService) {}
  
    // ngOnInit(): void {
    //   this.userService.getUsers().subscribe((data) => {
    //     this.users = data.filter((user) => !user.isModerator);
    //   });
    // }
  
    // makeAdmin(): void {
    //   if (this.selectedUserId) {
    //     this.userService.makeAdmin(this.selectedUserId).subscribe(() => {
    //       // handle success
    //       alert('User has been promoted to admin');
    //       this.ngOnInit(); // Refresh the list
    //     });
    //   }
    // }
}
