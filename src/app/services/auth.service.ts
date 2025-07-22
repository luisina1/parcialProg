import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  changePassword(newPassword: string) {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.updatePassword(newPassword);
      } else {
        return Promise.reject(new Error('No hay usuario autenticado'));
      }
    });
  }
}
