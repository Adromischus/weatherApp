import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Hometown } from '../../models/usersHometown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hometown',
  templateUrl: './hometown.component.html',
  styleUrls: ['./hometown.component.css'],
})
export class HometownComponent implements OnInit {
  locationForm?: FormGroup;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.locationForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      hometown: new FormControl('', [Validators.required]),
    });
  }

  userSelectLocation(): void {
    const reqBody: Hometown = {
      username: localStorage.getItem('username'),
      hometown: this.locationForm?.value.hometown,
    };
    this.userService.userSelectLocation(reqBody).subscribe((msg) => {
      console.log(msg);
      this.router.navigate(['']);
    });
  }
}
