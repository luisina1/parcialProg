import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // <-- Importar Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router  // <-- Inyectar Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.auth.login(email, password)
        .then(() => {
          this.errorMessage = '';
          this.router.navigate(['/characters']);  // <-- Redirigir aquí
        })
        .catch(err => {
          this.errorMessage = err.message;
        });
    }
  }

  register() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.auth.register(email, password)
        .then(() => {
          this.errorMessage = '';
          this.router.navigate(['/characters']); // También podés redirigir al registrar
        })
        .catch(err => {
          this.errorMessage = err.message;
        });
    }
  }
}
