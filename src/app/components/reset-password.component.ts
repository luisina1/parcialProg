import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  sendReset() {
    this.message = '';
    this.error = '';

    this.authService.resetPassword(this.email)
      .then(() => this.message = 'Email enviado con instrucciones para restablecer la contraseña.')
      .catch(err => this.error = err.message);
  }
}
