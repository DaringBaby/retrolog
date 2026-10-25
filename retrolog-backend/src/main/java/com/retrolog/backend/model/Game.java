package com.retrolog.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String platform;
    private String coverUrl;
    private String status;
    private Integer year;
    private Integer rating;

    public Game () {}

    public Game(String title, String platform, String coverUrl, String status, Integer year, Integer rating) {
        this.title = title;
        this.platform = platform;
        this.coverUrl = coverUrl;
        this.status = status;
        this.year = year;
        this.rating = rating;
    }

    public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getPlatform() { return platform; }
        public void setPlatform(String platform) { this.platform = platform; }

        public String getCoverUrl() { return coverUrl; }
        public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
}
