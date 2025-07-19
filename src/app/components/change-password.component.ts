import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  newPassword = '';
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  changePassword() {
    this.message = '';
    this.error = '';

    this.authService.changePassword(this.newPassword)
      .then(() => this.message = 'Contraseña actualizada correctamente.')
      .catch(err => this.error = err.message);
  }
}
