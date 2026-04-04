package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.request.LoginRequest;
import pl.piomin.services.model.dto.request.OAuth2Request;
import pl.piomin.services.model.dto.request.ProfileUpdateRequest;
import pl.piomin.services.model.dto.request.RefreshTokenRequest;
import pl.piomin.services.model.dto.request.RegisterRequest;
import pl.piomin.services.model.dto.response.AuthResponse;
import pl.piomin.services.model.dto.response.UserResponse;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/oauth2/google")
    public ResponseEntity<AuthResponse> googleAuth(@Valid @RequestBody OAuth2Request request) {
        return ResponseEntity.ok(authService.authenticateWithGoogle(request.getIdToken()));
    }

    @PostMapping("/oauth2/apple")
    public ResponseEntity<AuthResponse> appleAuth(@Valid @RequestBody OAuth2Request request) {
        return ResponseEntity.ok(authService.authenticateWithApple(request.getIdToken(), request.getFullName()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@CurrentUser UserDetails userDetails) {
        return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@CurrentUser UserDetails userDetails,
                                                       @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(authService.updateProfile(userDetails.getUsername(), request));
    }
}
