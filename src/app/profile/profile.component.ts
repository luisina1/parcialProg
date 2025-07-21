import { Component, OnInit } from '@angular/core';
import { ProfileService, UserProfile } from '../services/profile.service';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = { displayName: '', photoURL: '', bio: '' };
  loading = true;
  error = '';

  constructor(private profileService: ProfileService, private router: Router) {} 

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
      this.loading = false;
    });
  }

  saveProfile(): void {
    this.profileService.updateUserProfile(this.profile)
      .then(() => {
        alert('Perfil actualizado con éxito');
        this.router.navigate(['/characters']); 
      })
      .catch((err: any) => this.error = err.message);
  }

  deleteProfile(): void {
    if (confirm('¿Estás segura que querés borrar tu perfil? Esta acción no se puede deshacer.')) {
      this.profileService.deleteUserProfile()
        .then(() => {
          alert('Perfil eliminado');
          this.profile = { displayName: '', photoURL: '', bio: '' };
          this.router.navigate(['/characters']); 
        })
        .catch((err: any) => this.error = err.message);
    }
  }

  deleteAccount(): void {
    if (confirm('¿Estás segura que querés eliminar tu cuenta? Esta acción es irreversible.')) {
      this.profileService.deleteUserAccount()
        .then(() => {
          alert('Cuenta eliminada correctamente.');
          this.router.navigate(['/login']); // Redirige al login o página principal
        })
        .catch((err: any) => {
          this.error = err.message;
          alert('Error al eliminar la cuenta: ' + err.message);
        });
    }
  }
}
