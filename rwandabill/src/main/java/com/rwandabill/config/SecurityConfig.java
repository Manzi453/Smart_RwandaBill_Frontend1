package com.rwandabill.config;

import com.rwandabill.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Enable detailed request logging
        http
            .httpBasic().disable()
            .formLogin().disable()
            .logout().disable()
            .requestCache().disable()
            .securityContext().disable()
            .sessionManagement().disable()
            .exceptionHandling().disable()
            .headers().frameOptions().disable();
            
        // Configure CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        // Disable CSRF
        http.csrf(csrf -> csrf.disable());
        
        // Configure authorization - permit all for now
        http.authorizeHttpRequests(authz -> authz
            .anyRequest().permitAll()
        );
        
        // Add JWT filter but don't enforce it for now
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        // Log security events
        http.securityContext(securityContext -> securityContext.requireExplicitSave(false))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exception -> exception
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    System.out.println("Access Denied! " + accessDeniedException.getMessage());
                    response.setStatus(403);
                    response.getWriter().write("Access Denied: " + accessDeniedException.getMessage());
                })
            );
            
        // Log the security configuration
        System.out.println("Security configuration applied - PERMISSIVE MODE ENABLED");

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow all origins for development
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
