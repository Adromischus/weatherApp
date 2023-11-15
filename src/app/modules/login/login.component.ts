import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Login } from '../../models/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm?: FormGroup;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),

      password: new FormControl('', [Validators.required]),
    });
  }

  login(): void {
    const reqBody: Login = {
      username: this.loginForm?.value.username,
      password: this.loginForm?.value.password,
    };
    this.userService.login(reqBody).subscribe();
  }
}
