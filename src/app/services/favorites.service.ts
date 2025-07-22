import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Character } from './rickmorty.service';

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
      switchMap(user => user
        ? this.afs.collection<Character>(this.getFavoritesPath(user.uid)).valueChanges()
        : of([])
      )
    ).subscribe(favs => this.favoritesSubject.next(favs));
  }

  private getFavoritesPath(uid: string): string {
    return `users/${uid}/favorites`;
  }

  private getNotesPath(uid: string): string {
    return `users/${uid}/notes`;
  }

  private async getCurrentUserId(): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  // Favoritos
  async addFavorite(character: Character): Promise<void> {
    const uid = await this.getCurrentUserId();
    return this.afs.doc(`${this.getFavoritesPath(uid)}/${character.id}`).set(character);
  }

  async removeFavorite(characterId: number): Promise<void> {
    const uid = await this.getCurrentUserId();
    return this.afs.doc(`${this.getFavoritesPath(uid)}/${characterId}`).delete();
  }

  async updateFavorite(characterId: number, data: Partial<Character>): Promise<void> {
    const uid = await this.getCurrentUserId();
    return this.afs.doc(`${this.getFavoritesPath(uid)}/${characterId}`).update(data);
  }

  isFavorite(characterId: number): Observable<boolean> {
    return this.favorites$.pipe(
      map(favs => favs.some(fav => fav.id === characterId))
    );
  }

  // Notas (colección separada)
  async updateNote(characterId: number, note: string): Promise<void> {
    const uid = await this.getCurrentUserId();
    return this.afs.doc(`${this.getNotesPath(uid)}/${characterId}`).set({ note });
  }

  getNote(characterId: number): Observable<string | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (!user) return of(undefined);
        return this.afs.doc<{ note: string }>(`${this.getNotesPath(user.uid)}/${characterId}`)
          .valueChanges()
          .pipe(map(doc => doc?.note));
      })
    );
  }
}
