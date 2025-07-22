import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, UserProfile } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = { displayName: '', photoURL: '', bio: '' };
  loading = true;
  error = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        if (data) this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    this.profileService.updateUserProfile(this.profile)
      .then(() => {
        alert('Perfil actualizado con éxito');
        this.router.navigate(['/characters']);
      })
      .catch(err => this.error = err.message);
  }

  deleteProfile(): void {
    if (!confirm('¿Estás segura que querés borrar tu perfil? Esta acción no se puede deshacer.')) return;

    this.profileService.deleteUserProfile()
      .then(() => {
        alert('Perfil eliminado');
        this.profile = { displayName: '', photoURL: '', bio: '' };
        this.router.navigate(['/characters']);
      })
      .catch(err => this.error = err.message);
  }

  deleteAccount(): void {
    if (!confirm('¿Estás segura que querés eliminar tu cuenta? Esta acción es irreversible.')) return;

    this.profileService.deleteUserAccount()
      .then(() => {
        alert('Cuenta eliminada correctamente.');
        this.router.navigate(['/login']);
      })
      .catch(err => {
        this.error = err.message;
        alert('Error al eliminar la cuenta: ' + err.message);
      });
  }
}
