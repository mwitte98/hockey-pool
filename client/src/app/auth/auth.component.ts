import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../shared/services/user.service';
import { User } from '../shared/types/interfaces';

@Component({
  selector: 'auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authType: string;
  authTypeCapital: string;
  errors: string[] = [];
  errorMessage: string = null;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user: User) => {
      if (user != null) {
        this.router.navigateByUrl('/').catch();
      } else if (user === null) {
        this.authForm = this.fb.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
        });

        this.route.url.subscribe((data) => {
          this.authType = data[data.length - 1].path;
          this.authTypeCapital = this.authType.charAt(0).toUpperCase() + this.authType.slice(1);
          if (this.authType === 'register') {
            this.authForm.addControl('password_confirmation', new FormControl('', Validators.required));
          }
        });
      }
    });
  }

  submitForm(): void {
    const credentials = this.authForm.value;
    if (this.authType === 'register' && credentials.password !== credentials.password_confirmation) {
      this.errorMessage = 'Passwords do not match';
    } else {
      this.userService.auth(this.authType, credentials).subscribe(
        () => {
          this.router.navigateByUrl('/').catch();
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error.errors;
        }
      );
    }
  }
}
