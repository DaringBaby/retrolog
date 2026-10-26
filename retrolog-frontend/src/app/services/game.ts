import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // client integrato per chiamate http asincrone
import { Observable } from 'rxjs'; // per flussi di dati asincroni
import { Game } from '../models/game.model'

@Injectable({             // servizio a livello radice (singleton)/globale
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);                            // inietta istanza del client http
  private apiUrl = '/api/games';

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);                  // invia richiesta http get con dati in array di tipo Game
  }

  addGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, game);             // invia richiesta http post passando l'oggetto game e serializzandolo in una stringa json, e il backend lo salva su postgresql
  }

  deleteGame(id: number): Observable<void> {                    // cancella un record usando un template literal per url dinamico con richiesta http delete
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
