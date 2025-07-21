import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface UserProfile {
  displayName: string;
  photoURL: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  getUserProfile(): Observable<UserProfile | null> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const docRef = this.afs.doc<UserProfile>(`users/${user.uid}/profile/data`);
          return docRef.valueChanges().pipe(
            switchMap(profile => of(profile ?? null))
          );
        } else {
          return of(null);
        }
      })
    );
  }

  updateUserProfile(profile: UserProfile): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (!user) throw new Error('Usuario no autenticado');
      const docRef = this.afs.doc<UserProfile>(`users/${user.uid}/profile/data`);
      return docRef.set(profile, { merge: true });
    });
  }

  deleteUserProfile(): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (!user) throw new Error('Usuario no autenticado');
      const docRef = this.afs.doc<UserProfile>(`users/${user.uid}/profile/data`);
      return docRef.delete();
    });
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
