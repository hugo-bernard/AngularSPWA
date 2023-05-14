import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  loginForm!: FormGroup;
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.ConfigService.login({
        "email": this.loginForm.value.email,
        "password": this.loginForm.value.password,
      }).subscribe({
        next: data => {
          this.sharedService.myUserToken = data
          localStorage.setItem('authToken', JSON.stringify(this.sharedService.myUserToken))
          const token = localStorage.getItem('authToken')
          if (token) {
            this.ConfigService.getUserFromToken(JSON.parse(token).token).subscribe({
              next: data => {
                this.showErr = false
                this.isLoading = false;
                this.sharedService.myUser = data
                if (this.sharedService.myUserToken) {
                  this.router.navigate(['/questions'])
                }
              },
              error: error => {
                console.error('There was an error login in!', error);
                this.showErr = true
                this.isLoading = false;
              }
            });
          }
        },
        error: error => {
          console.error('There was an error login in!', error);
          this.showErr = true
          this.isLoading = false;
        }
      });
    }
  }
}
