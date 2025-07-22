import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { Character } from '../services/rickmorty.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<Character[]>;
  noteValues: { [characterId: number]: string } = {};

  constructor(private favoritesService: FavoritesService) {
    this.favorites$ = this.favoritesService.favorites$;
  }

  ngOnInit(): void {
    this.favorites$.subscribe(favorites => {
      favorites.forEach(fav => {
        this.favoritesService.getNote(fav.id).subscribe(note => {
          this.noteValues[fav.id] = note ?? '';
        });
      });
    });
  }

  onNoteChange(character: Character, newNote: string) {
    this.favoritesService.updateNote(character.id, newNote)
      .then(() => {
        this.noteValues[character.id] = newNote;
        console.log(`Nota actualizada para ${character.name}`);
      })
      .catch(err => console.error(err));
  }

  removeFavorite(characterId: number) {
    this.favoritesService.removeFavorite(characterId)
      .then(() => console.log('Favorito eliminado'))
      .catch(err => console.error(err));
  }
}
