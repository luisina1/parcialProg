import { Component, OnInit } from '@angular/core';
import { FavoritesService, Character } from '../services/favorites.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<Character[]>;

  constructor(private favoritesService: FavoritesService) {
    this.favorites$ = this.favoritesService.favorites$;
  }

  ngOnInit(): void {}

  onNoteChange(character: Character, newNote: string) {
    this.favoritesService.updateFavorite(character.id, { note: newNote })
      .then(() => console.log(`Nota actualizada para ${character.name}`))
      .catch(err => console.error(err));
  }

  removeFavorite(characterId: number) {
    this.favoritesService.removeFavorite(characterId)
      .then(() => console.log('Favorito eliminado'))
      .catch(err => console.error(err));
  }
}
