import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService.login(email, password)
      .then(() => this.router.navigate(['/characters']))
      .catch(err => this.errorMessage = err.message);
  }

  register() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService.register(email, password)
      .then(() => this.router.navigate(['/characters']))
      .catch(err => this.errorMessage = err.message);
  }
}
