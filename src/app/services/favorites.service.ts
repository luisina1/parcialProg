import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Character } from './rickmorty.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Character[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private notesSubject = new BehaviorSubject<Record<number, string>>({});
  notes$ = this.notesSubject.asObservable();

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const favs$ = this.afs.collection<Character>(`users/${user.uid}/favorites`).valueChanges();

          const notes$ = this.afs.collection<{ note: string }>(`users/${user.uid}/notes`).snapshotChanges().pipe(
            map(actions => {
              const notesMap: Record<number, string> = {};
              actions.forEach(a => {
                const id = Number(a.payload.doc.id);
                const data = a.payload.doc.data();
                if (data.note) {
                  notesMap[id] = data.note;
                }
              });
              return notesMap;
            })
          );

          return combineLatest([favs$, notes$]).pipe(
            map(([favs, notesMap]) => {
              return favs.map(c => ({
                ...c,
                note: notesMap[c.id] || ''
              }));
            })
          );
        } else {
          return of([]);
        }
      })
    ).subscribe(favsWithNotes => this.favoritesSubject.next(favsWithNotes));
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

  updateFavorite(characterId: number, data: Partial<Character>): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (!user) throw new Error('Usuario no autenticado');
      return this.afs.doc(`users/${user.uid}/favorites/${characterId}`).update(data);
    });
  }

  updateNote(characterId: number, note: string): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (!user) throw new Error('Usuario no autenticado');
      return this.afs.doc(`users/${user.uid}/notes/${characterId}`).set({ note });
    });
  }

  getNote(characterId: number): Observable<string> {
    return this.notes$.pipe(
      map(notes => notes[characterId] || '')
    );
  }

  isFavorite(characterId: number): Observable<boolean> {
    return this.favorites$.pipe(
      map(favs => favs.some(fav => fav.id === characterId))
    );
  }
}
