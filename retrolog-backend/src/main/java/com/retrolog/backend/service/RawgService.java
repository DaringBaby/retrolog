package com.retrolog.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.retrolog.backend.dto.RawgGameDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service                        // registra la classe come Bean rendendola iniettabile nei controller tramite @Autowired
public class RawgService {
    @Value("${rawg.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();          // RestClient invia richieste get/post verso server esterni
    private final ObjectMapper objectMapper = new ObjectMapper();      // passa il json grezzo per navigarlo come un albero di nodi

    public List<RawgGameDto> searchGames(String query) {                // cerca il gioco in base alla stringa dell'utente e restutyuisce una lista di DTo per il frontend
        List<RawgGameDto> results = new ArrayList<>();                  // lista giochi
        String url = "https://api.rawg.io/api/games?key=" + apiKey + "&search=" + query + "&page_size=5";       // url composto, max 5 risultati

        try {
            String response = restClient.get().uri(url).retrieve().body(String.class);

            JsonNode root = objectMapper.readTree(response);        // converte la stringa json in una struttura ad albero navigabile
            JsonNode games = root.path("results");                  // estrae l'array results

            for (JsonNode node : games) {
                String title = node.path("name").asText();
                String coverUrl = node.path("background_image").asText(null);
                Integer year = null;
                String released = node.path("released").asText(null);

                if (released != null && released.length() >= 4) {
                    try {
                        year = Integer.parseInt(released.substring(0,4));
                    } catch (NumberFormatException ignored) {
                        //
                    }
                }

                // RAWG restituisce le piattaforme come un array di oggetti annidati, prendiamo la prima
                String platform = "Multi";
                JsonNode platformsNode = node.path("platforms");
                if (platformsNode.isArray() && !platformsNode.isEmpty()) {
                    platform = platformsNode.get(0).path("platform").path("name").asText("Multi");


                }
                // creare oggetto DTO ed aggiungiamolo alla lista
                results.add(new RawgGameDto(title, platform, coverUrl, year));
            }
        } catch (Exception e) {
            e.printStackTrace();
            }
        return results;
    }
}
