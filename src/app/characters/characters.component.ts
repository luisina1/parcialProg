import { Component, OnInit } from '@angular/core';
import { RickmortyService, Character, ApiResponse } from '../services/rickmorty.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  loading: boolean = false;

  // Filtros
  filterStatus: string = '';
  filterSpecies: string = '';
  filterGender: string = '';

  // Orden
  sortOption: string = '';

  constructor(private rickmortyService: RickmortyService) {}

  ngOnInit(): void {
    this.loadCharacters(); // Carga inicial
  }

  loadCharacters(page: number = 1): void {
    this.loading = true;

    const filters = [];

    if (this.searchTerm.trim() !== '') {
      filters.push(`name=${this.searchTerm.trim()}`);
    }
    if (this.filterStatus) {
      filters.push(`status=${this.filterStatus}`);
    }
    if (this.filterSpecies) {
      filters.push(`species=${this.filterSpecies}`);
    }
    if (this.filterGender) {
      filters.push(`gender=${this.filterGender}`);
    }

    filters.push(`page=${page}`);
    const query = filters.join('&');

    this.rickmortyService.getFilteredCharacters(query).subscribe({
      next: (response: ApiResponse) => {
        this.characters = response.results;
        this.totalPages = response.info.pages;
        this.currentPage = page;
        this.loading = false;
        this.sortCharacters(); // Aplica ordenamiento si hay uno seleccionado
      },
      error: () => {
        this.characters = [];
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  // Se llama al cambiar el texto del input
  searchCharacters(): void {
    this.loadCharacters(1);
  }

  // Se llama al cambiar algún filtro
  updateFilters(): void {
    this.loadCharacters(1);
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
  if (this.sortOption === 'name-asc') {
    this.characters.sort((a, b) => a.name.localeCompare(b.name));
  } else if (this.sortOption === 'name-desc') {
    this.characters.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    this.loadCharacters(this.currentPage); // Vuelve a cargar sin orden
  }
}
}
