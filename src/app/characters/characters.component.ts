import { Component, OnInit, Renderer2 } from '@angular/core';
import { RickmortyService, Character, ApiResponse } from '../services/rickmorty.service';
import { FavoritesService } from '../services/favorites.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { ProfileService, UserProfile } from '../services/profile.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  user$: Observable<firebase.User | null>;
  userEmail: string | null = null;
  profile: UserProfile | null = null;

  characters: Character[] = [];
  favorites: Character[] = [];
  favoritesIds = new Set<number>();
  episodesNames: string[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  loading: boolean = false;

  filterStatus: string = '';
  filterSpecies: string = '';
  filterGender: string = '';
  sortOption: string = '';

  selectedCharacter: Character | null = null;

  showFavoritesOnly: boolean = false;

  noResults: boolean = false;
  errorLoading: boolean = false;

  isDarkTheme: boolean = false;

  constructor(
    private rickmortyService: RickmortyService,
    private favoritesService: FavoritesService,
    private renderer: Renderer2,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      this.userEmail = user ? user.email : null;
    });

    this.profileService.getUserProfile().pipe(
      map(profile => profile ?? null)
    ).subscribe(profile => {
      this.profile = profile;
    });

    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
      this.favoritesIds = new Set(favs.map(f => f.id));
      if (this.showFavoritesOnly) {
        this.characters = [...this.favorites];
        this.noResults = this.characters.length === 0;
      }
    });

    this.loadCharacters();
  }

  loadCharacters(page: number = 1): void {
    if (this.showFavoritesOnly) {
      this.characters = [...this.favorites];
      this.noResults = this.characters.length === 0;
      this.errorLoading = false;
      this.totalPages = 1;
      this.currentPage = 1;
      this.sortCharacters();
      return;
    }

    this.loading = true;
    this.errorLoading = false;
    this.noResults = false;

    const filters = [];

    if (this.searchTerm.trim()) filters.push(`name=${this.searchTerm.trim()}`);
    if (this.filterStatus) filters.push(`status=${this.filterStatus}`);
    if (this.filterSpecies) filters.push(`species=${this.filterSpecies}`);
    if (this.filterGender) filters.push(`gender=${this.filterGender}`);
    filters.push(`page=${page}`);
    const query = filters.join('&');

    this.rickmortyService.getFilteredCharacters(query).subscribe({
      next: (res: ApiResponse) => {
        this.characters = res.results || [];
        this.totalPages = res.info.pages || 1;
        this.currentPage = page;
        this.loading = false;
        this.noResults = this.characters.length === 0;
        this.sortCharacters();
      },
      error: () => {
        this.characters = [];
        this.totalPages = 0;
        this.currentPage = 1;
        this.loading = false;
        this.errorLoading = true;
      }
    });
  }

  searchCharacters(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  updateFilters(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadCharacters(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadCharacters(this.currentPage + 1);
    }
  }

  sortCharacters(): void {
    if (!this.characters) return;
    if (this.sortOption === 'name-asc') {
      this.characters.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      this.characters.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  openModal(character: Character): void {
    this.selectedCharacter = character;
    this.episodesNames = [];

    if (character.episode && character.episode.length) {
      character.episode.forEach(url => {
        this.rickmortyService.getEpisodeByUrl(url).subscribe(ep => {
          this.episodesNames.push(ep.name);
        });
      });
    }
  }

  closeModal(): void {
    this.selectedCharacter = null;
    this.episodesNames = [];
  }

  toggleFavorite(character: Character): void {
    if (this.favoritesIds.has(character.id)) {
      this.favoritesService.removeFavorite(character.id).catch(console.error);
    } else {
      this.favoritesService.addFavorite(character).catch(console.error);
    }
  }

  isFavorite(character: Character): boolean {
    return this.favoritesIds.has(character.id);
  }

  toggleFavoritesView(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    if (this.showFavoritesOnly) {
      this.characters = [...this.favorites];
      this.noResults = this.characters.length === 0;
      this.totalPages = 1;
      this.currentPage = 1;
      this.errorLoading = false;
    } else {
      this.loadCharacters();
    }
  }

  logout(): void {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(console.error);
  }

  onNoteChange(character: Character, newNote: string) {
    this.favoritesService.updateNote(character.id, newNote)
      .then(() => console.log(`Nota guardada para ${character.name}`))
      .catch(console.error);
  }
}

