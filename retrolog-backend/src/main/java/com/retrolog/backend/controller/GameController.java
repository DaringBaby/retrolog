package com.retrolog.backend.controller;

import com.retrolog.backend.model.Game;
import com.retrolog.backend.repository.GameRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/games")
@CrossOrigin(origins = "http://localhost:4200")
public class GameController {
    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
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
}
