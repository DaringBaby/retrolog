import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game';
import { RouterOutlet } from '@angular/router';
import { Game } from './models/game.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private gameService = inject(GameService);

  games = signal<Game[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadGames();
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

  deleteGame(id?: number): void {
    if (!id) return;
    this.gameService.deleteGame(id).subscribe({
      next: () => {
        this.games.update((prev) => prev.filter((g) => g.id !== id));
      },
      error: (err) => console.error('Errore durante eliminazione: ', err)
    })
  }
}
