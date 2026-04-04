package pl.piomin.services.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import pl.piomin.services.config.JwtConfig;
import pl.piomin.services.model.entity.User;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private User testUser;

    @BeforeEach
    void setUp() {
        JwtConfig config = new JwtConfig();
        config.setSecret("dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLW9ubHktMzItYnl0ZXMtbG9uZw==");
        config.setExpiration(3600000);
        config.setRefreshExpiration(7200000);

        jwtTokenProvider = new JwtTokenProvider(config);

        testUser = new User();
        testUser.setId(1L);
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");
    }

    @Test
    void generateToken_shouldReturnValidToken() {
        String token = jwtTokenProvider.generateToken(testUser);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {
        String token = jwtTokenProvider.generateToken(testUser);
        String email = jwtTokenProvider.extractEmail(token);
        assertEquals("test@example.com", email);
    }

    @Test
    void extractUserId_shouldReturnCorrectId() {
        String token = jwtTokenProvider.generateToken(testUser);
        Long userId = jwtTokenProvider.extractUserId(token);
        assertEquals(1L, userId);
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        String token = jwtTokenProvider.generateToken(testUser);
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "test@example.com", "", Collections.emptyList());
        assertTrue(jwtTokenProvider.isTokenValid(token, userDetails));
    }

    @Test
    void isTokenValid_shouldReturnFalseForWrongUser() {
        String token = jwtTokenProvider.generateToken(testUser);
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "other@example.com", "", Collections.emptyList());
        assertFalse(jwtTokenProvider.isTokenValid(token, userDetails));
    }

    @Test
    void generateRefreshToken_shouldReturnDifferentToken() {
        String accessToken = jwtTokenProvider.generateToken(testUser);
        String refreshToken = jwtTokenProvider.generateRefreshToken(testUser);
        assertNotNull(refreshToken);
        // Different tokens (different expiration times)
        assertFalse(accessToken.equals(refreshToken));
    }
}
