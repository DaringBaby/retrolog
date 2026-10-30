import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Game } from './models/game.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private gameService = inject(GameService);

  games = signal<Game[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // filtro giochi
  activeFilter = signal<string>('All');
  // calcolo giochi in base al filtro
  filteredGames = computed(() => {
    const filter = this.activeFilter();
    const all = this.games();
    if (filter === 'All') return all;
    return all.filter((g) => g.status?.toLowerCase() === filter.toLowerCase());
  })

  // signals rawg
  searchQuery = signal<string>('');
  searchResults = signal<Game[]>([]);
  isSearching = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  selectedGameToSave = signal<Game | null>(null);
  selectedStatus = signal<string>('Backlog');
  selectedRating = signal<number>(8);


  ngOnInit(): void {
    this.loadGames();
    this.initSearchPipeline();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  private initSearchPipeline(): void {
      this.searchSub = this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          const cleanQuery = query.trim();
          if (cleanQuery.length < 2) {
            this.isSearching.set(false);
            this.searchResults.set([]);
            return of([]);
          }

          this.isSearching.set(true);
          return this.gameService.searchGames(cleanQuery).pipe(
            catchError((err) => {
              console.error('Errore ricerca RAWG:', err);
              this.isSearching.set(false);
              return of([]);
            })
          );
        })
      ).subscribe((results) => {
        this.searchResults.set(results);
        this.isSearching.set(false);
      });
    }

  loadGames(): void {
    this.isLoading.set(true);
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.games.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore durante il recupero dei giochi: ', err);
        this.errorMessage.set('Impossibile caricare i giochi.');
        this.isLoading.set(false);
      }
    })
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  openSaveModal(rawgGame: Game): void {
    this.selectedGameToSave.set(rawgGame);
    this.selectedStatus.set('Backlog');
    this.selectedRating.set(8);
  }

  cancelSave(): void {
    this.selectedGameToSave.set(null);
  }

  confirmSave(): void {
    const rawgGame = this.selectedGameToSave();
    if (!rawgGame) return;
    const newGame: Game = {
      title: rawgGame.title,
      platform: rawgGame.platform,
      year: rawgGame.year,
      coverUrl: rawgGame.coverUrl,
      status: this.selectedStatus(),
      rating: this.selectedRating()
    };

    this.gameService.addGame(newGame).subscribe({
      next: (savedGame) => {
        this.games.update((list) => [savedGame, ...list]);    // aggiunge gioco a schermo
        this.searchQuery.set('');                             // pulisce barra di ricerca
        this.searchResults.set([]);
        this.selectedGameToSave.set(null);
      },
      error: (err) => console.error('Errore durante il salvataggio:', err)
    });
  }

  updateGameStatus(game: Game, newStatus: string): void {
    if (!game.id) return;

    const updatedData = { ...game, status: newStatus };

    this.gameService.updateGame(game.id, updatedData).subscribe({
      next: (saved) => {
        // aggiorna stato del gioco nella lista
        this.games.update((list) =>
          list.map((g) => (g.id === saved.id ? saved : g))
        );
      },
      error: (err) => console.error('Errore di aggiornamento stato:', err)
    });
  }

  updateGameRating(game: Game, newRating: number): void {
    if (!game.id) return;

    const updatedData: Game = { ...game, rating: newRating };     //crea copia aggiornando solo campo rating
    // invia richiesta
    this.gameService.updateGame(game.id, updatedData).subscribe({
      next: (saved) => {
        this.games.update((list) =>
          list.map((g) => (g.id === saved.id ? saved : g))
        );
      },
      error: (err) => console.error('Errore aggiornamento voto:', err)
    });
  }

  deleteGame(id?: number): void {
    if (!id) return;
    this.gameService.deleteGame(id).subscribe({
      next: () => {
        this.games.update((prev) => prev.filter((g) => g.id !== id));
      },
      error: (err) => console.error('Errore durante eliminazione: ', err)
    })
  }

  setFilter(status: string): void {
    this.activeFilter.set(status);
  }

  // widget statistiche
  totalGames = computed(() => this.games().length);
  completedGames = computed(() =>
    this.games().filter((g) => g.status?.toLowerCase() === 'completed').length);

  // media voto
  averageRating = computed(() => {
    const list = this.games();
    if (list.length === 0) return 0;

    const totalScore = list.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avg = totalScore / list.length;

    return Math.round(avg * 10) / 10;
  })
}
