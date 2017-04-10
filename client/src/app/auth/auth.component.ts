import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService } from '../shared';

@Component({
  selector: 'auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: string;
  authTypeCapital: string;
  errors: Errors = new Errors();
  error_message: string = null;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.authTypeCapital = this.authType.charAt(0).toUpperCase() + this.authType.slice(1);
      if (this.authType === 'register') {
        this.authForm.addControl('password_confirmation', new FormControl('', Validators.required));
      }
    });
  }

  submitForm() {
    const credentials = this.authForm.value;
    if (this.authType === 'register' && credentials['password'] !== credentials['password_confirmation']) {
      this.error_message = 'Passwords do not match';
    } else {
      this.userService.auth(this.authType, credentials)
        .subscribe(
          data => this.router.navigateByUrl('/'),
          errors => {
            this.errors = errors;
          }
        );
    }
  }
}
