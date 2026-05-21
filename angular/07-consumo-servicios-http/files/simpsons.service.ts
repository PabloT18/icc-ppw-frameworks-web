import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    Options,
    SimpsonsCharacter,
    SimpsonsResponse,
} from '../models/simpsons.interface';

@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCharacters(page: number = 1): Observable<SimpsonsResponse> {
    return this.http
      .get<SimpsonsResponse>(`${this.baseUrl}/characters?page=${page}`)
      .pipe(
        catchError(() =>
          throwError(() => new Error('No se pudieron cargar los personajes'))
        )
      );
  }

  getCharactersOptions(options: Options = {}): Observable<SimpsonsResponse> {
    const { page = 1, limit = 10 } = options;
    return this.http
      .get<SimpsonsResponse>(
        `${this.baseUrl}/characters?page=${page}&limit=${limit}`
      )
      .pipe(
        catchError(() =>
          throwError(() => new Error('No se pudieron cargar los personajes'))
        )
      );
  }

  getCharacterById(id: number): Observable<SimpsonsCharacter> {
    return this.http
      .get<SimpsonsCharacter>(`${this.baseUrl}/characters/${id}`)
      .pipe(
        catchError(() =>
          throwError(() => new Error(`Personaje ${id} no encontrado`))
        )
      );
  }
}
