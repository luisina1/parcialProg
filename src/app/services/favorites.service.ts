import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // o la versión que uses
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Character } from './rickmorty.service'; // ajusta la ruta si hace falta

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Character[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.collection<Character>(`users/${user.uid}/favorites`).valueChanges();
        } else {
          return of([]);
        }
      })
    ).subscribe(favs => this.favoritesSubject.next(favs));
  }

  addFavorite(character: Character): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (!user) throw new Error('Usuario no autenticado');
      return this.afs.doc(`users/${user.uid}/favorites/${character.id}`).set(character);
    });
  }

  removeFavorite(characterId: number): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (!user) throw new Error('Usuario no autenticado');
      return this.afs.doc(`users/${user.uid}/favorites/${characterId}`).delete();
    });
  }

  isFavorite(characterId: number): Observable<boolean> {
    return this.favorites$.pipe(
      map(favs => favs.some(fav => fav.id === characterId))
    );
  }
}
