import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm?: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),

      password: new FormControl('', [Validators.required]),
    });
  }

  loginSubmit(): void {
    console.log(this.loginForm?.value);
  }
}
