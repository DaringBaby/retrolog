package com.retrolog.backend.controller;

import com.retrolog.backend.dto.RawgGameDto;
import com.retrolog.backend.model.Game;
import com.retrolog.backend.repository.GameRepository;
import com.retrolog.backend.service.RawgService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:4200")
public class GameController {

    private final GameRepository gameRepository;
    private final RawgService rawgService;

    public GameController(GameRepository gameRepository, RawgService rawgService) {
        this.gameRepository = gameRepository;
        this.rawgService = rawgService;
    }

    @GetMapping
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @PostMapping
    public Game addGame(@RequestBody Game game) {
        return gameRepository.save(game);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        if (!gameRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        gameRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<RawgGameDto> searchRawg(@RequestParam String query) {
        return rawgService.searchGames(query);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Long id, @RequestBody Game updatedGame) {
        return gameRepository.findById(id)
        .map(game -> {
            game.setStatus(updatedGame.getStatus());
            game.setRating(updatedGame.getRating());
            if (updatedGame.getTitle() != null) game.setTitle(updatedGame.getTitle());
            if (updatedGame.getPlatform() != null) game.setPlatform(updatedGame.getPlatform());
            return ResponseEntity.ok(gameRepository.save(game));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
