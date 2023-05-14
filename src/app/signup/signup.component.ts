import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  showErr: boolean = false

  constructor(
    private fb: FormBuilder,
    private ConfigService: ConfigService,
    private sharedService: SharedService,
    private router: Router
    ) { }

  ngOnInit() {
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/questions'])
    }
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.ConfigService.register({
        "name": this.signupForm.value.name,
        "email": this.signupForm.value.email,
        "password": this.signupForm.value.password,
      }).subscribe({
        next: data => {
          this.showErr = false
          this.isLoading = false;
          this.sharedService.myUserToken = data
          if (this.sharedService.myUserToken) {
            this.router.navigate(['/questions'])
          }
        },
        error: error => {
          console.error('There was an error!', error);
          this.showErr = true
          this.isLoading = false;
        }
      });
    }
  }
}
