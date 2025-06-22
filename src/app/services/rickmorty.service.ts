import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationInfo {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: LocationInfo;
  location: LocationInfo;
  episode: string[];
  created: string;
}

export interface ApiResponse {
  results: Character[];
  info: any;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

@Injectable({
  providedIn: 'root',
})
export class RickmortyService {
  private apiURL = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiURL}?page=${page}`);
  }

  searchCharacters(name: string, page: number = 1): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiURL}?name=${name}&page=${page}`);
  }

  getFilteredCharacters(query: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiURL}?${query}`);
  }

  getEpisodeByUrl(url: string): Observable<Episode> {
    return this.http.get<Episode>(url);
  }
}
