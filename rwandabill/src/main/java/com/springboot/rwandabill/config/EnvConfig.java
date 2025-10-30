package com.springboot.rwandabill.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class EnvConfig {

    @Value("${DB_URL:jdbc:postgresql://localhost:5432/rwandabill}")
    private String dbUrl;

    @Value("${DB_USERNAME:postgres}")
    private String dbUsername;

    @Value("${DB_PASSWORD:root}")
    private String dbPassword;

    @Value("${JWT_SECRET:defaultSecretKey12345678901234567890123456789012}")
    private String jwtSecret;

    @Value("${JWT_EXPIRATION_MS:86400000}")
    private long jwtExpirationMs;

    @Value("${ALLOWED_ORIGINS:*}")
    private String allowedOrigins;

    @Bean
    public String getDbUrl() {
        return dbUrl;
    }

    @Bean
    public String getDbUsername() {
        return dbUsername;
    }

    @Bean
    public String getDbPassword() {
        return dbPassword;
    }

    @Bean
    public String getJwtSecret() {
        return jwtSecret;
    }

    @Bean
    public long getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    @Bean
    public String[] getAllowedOrigins() {
        return allowedOrigins.split(",");
    }

    @PostConstruct
    public void logEnv() {
        System.out.println("=== Application Environment Variables ===");
        System.out.println("DB_URL: " + (dbUrl.contains("@") ? "[HIDDEN]" : dbUrl));
        System.out.println("DB_USERNAME: " + dbUsername);
        System.out.println("JWT_SECRET: " + (jwtSecret != null && !jwtSecret.isEmpty() ? "[HIDDEN]" : "Not set"));
        System.out.println("JWT_EXPIRATION_MS: " + jwtExpirationMs);
        System.out.println("ALLOWED_ORIGINS: " + allowedOrigins);
        System.out.println("======================================");
    }
}
