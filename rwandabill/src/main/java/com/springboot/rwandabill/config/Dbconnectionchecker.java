package com.springboot.rwandabill.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
class Dbconnectionchecker
{
    private static final Logger log = LoggerFactory.getLogger(Dbconnectionchecker.class);

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void checkConnection()
    {
        try
        {
            jdbcTemplate.execute("SELECT 1");
            log.info("Database connected successfully!");
        } catch (Exception e)
        {
            log.error("Failed to connect to database: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
