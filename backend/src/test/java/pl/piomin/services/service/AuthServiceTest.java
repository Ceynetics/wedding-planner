package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.exception.UnauthorizedException;
import pl.piomin.services.model.dto.request.LoginRequest;
import pl.piomin.services.model.dto.request.ProfileUpdateRequest;
import pl.piomin.services.model.dto.request.RegisterRequest;
import pl.piomin.services.model.dto.response.AuthResponse;
import pl.piomin.services.model.dto.response.UserResponse;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.enums.Gender;
import pl.piomin.services.repository.UserRepository;
import pl.piomin.services.security.JwtTokenProvider;
import pl.piomin.services.security.OAuth2TokenVerifier;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private OAuth2TokenVerifier oAuth2TokenVerifier;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .fullName("Test User")
                .email("test@example.com")
                .password("encoded-password")
                .gender(Gender.MALE)
                .age(30)
                .build();
        testUser.setId(1L);
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Test User")
                .email("test@example.com")
                .password("password123")
                .gender(Gender.MALE)
                .age(30)
                .build();

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any(User.class))).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("Test User", response.getUser().getFullName());
    }

    @Test
    void register_shouldThrowWhenEmailExists() {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@example.com")
                .build();

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldReturnTokensForValidCredentials() {
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);
        when(jwtTokenProvider.generateToken(any(User.class))).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
    }

    @Test
    void login_shouldThrowForInvalidEmail() {
        LoginRequest request = LoginRequest.builder()
                .email("wrong@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowForInvalidPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("wrong-password")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    void getCurrentUser_shouldReturnUserResponse() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        UserResponse response = authService.getCurrentUser("test@example.com");

        assertNotNull(response);
        assertEquals("Test User", response.getFullName());
        assertEquals("test@example.com", response.getEmail());
    }

    @Test
    void updateProfile_shouldUpdateUserFields() {
        ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                .fullName("Updated Name")
                .phone("1234567890")
                .bio("New bio")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserResponse response = authService.updateProfile("test@example.com", request);

        assertNotNull(response);
    }
}
