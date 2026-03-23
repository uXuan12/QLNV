package com.ems.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtProperties {

    /**
     * JWT secret key for signing tokens (minimum 256-bit)
     */
    private String secret = "mySecretKeyForJWTTokenGenerationAndValidationPurposeOnly12345";

    /**
     * Token expiration time in milliseconds (default 24 hours)
     */
    private long expiration = 86400000;
}
