import { Component, OnInit } from '@angular/core';
import { ProfileService, UserProfile } from '../services/profile.service'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = { name: '', photoUrl: '', bio: '' };
  loading = true;
  error = '';

  constructor(private profileService: ProfileService) {}

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
      .then(() => alert('Perfil actualizado con éxito'))
      .catch(err => this.error = err.message);
  }

  deleteProfile(): void {
    if (confirm('¿Estás seguro que quieres borrar tu perfil? Esta acción no se puede deshacer.')) {
      this.profileService.deleteUserProfile()
        .then(() => {
          alert('Perfil eliminado');
          this.profile = { name: '', photoUrl: '', bio: '' };
        })
        .catch(err => this.error = err.message);
    }
  }

  deleteUserAccount(): Promise<void> {
  return this.afAuth.currentUser.then(user => {
    if (!user) {
      return Promise.reject(new Error('Usuario no autenticado'));
    }
   
    const docRef = this.afs.doc<UserProfile>(`users/${user.uid}/profile/data`);
    return docRef.delete().then(() => {
      return user.delete();
    });
  });
}

}
