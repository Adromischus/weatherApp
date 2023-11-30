import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit {
  username: string = '';
  isAuthenticated: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsername();
    this.userService.isUserLoggedIn.subscribe({
      next: (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      },
    });
  }

  getUsername(): void {
    this.username = localStorage.getItem('username');
    console.log(this.username);
  }

  checkUserLoggedIn(): void {}
}
