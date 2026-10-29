package com.retrolog.backend.dto;

// dto per filtrare i dati da passare al modello Game

public class RawgGameDto {
    private String title;
    private String platform;
    private String coverUrl;
    private Integer year;

    public RawgGameDto() {}

    public RawgGameDto(String title, String platform, String coverUrl, Integer year) {
        this.title = title;
        this.platform = platform;
        this.coverUrl = coverUrl;
        this.year = year;
    }

    public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getPlatform() { return platform; }
        public void setPlatform(String platform) { this.platform = platform; }

        public String getCoverUrl() { return coverUrl; }
        public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
}
