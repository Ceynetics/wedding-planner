package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.BadRequestException;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.exception.UnauthorizedException;
import pl.piomin.services.mapper.EntityMapper;
import pl.piomin.services.model.dto.request.LoginRequest;
import pl.piomin.services.model.dto.request.ProfileUpdateRequest;
import pl.piomin.services.model.dto.request.RegisterRequest;
import pl.piomin.services.model.dto.response.AuthResponse;
import pl.piomin.services.model.dto.response.UserResponse;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.repository.UserRepository;
import pl.piomin.services.security.JwtTokenProvider;
import pl.piomin.services.security.OAuth2TokenVerifier;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OAuth2TokenVerifier oAuth2TokenVerifier;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider, OAuth2TokenVerifier oAuth2TokenVerifier) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.oAuth2TokenVerifier = oAuth2TokenVerifier;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .age(request.getAge())
                .gender(request.getGender())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);
        log.info("User registered: email={}", user.getEmail());
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: email={} (not found)", request.getEmail());
                    return new UnauthorizedException("Invalid email or password");
                });

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: email={} (invalid password)", request.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }

        log.info("User logged in: email={}", user.getEmail());
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse authenticateWithGoogle(String idToken) {
        OAuth2TokenVerifier.OAuth2UserInfo userInfo = oAuth2TokenVerifier.verifyGoogleToken(idToken);
        log.info("Google OAuth authentication: email={}", userInfo.getEmail());
        return handleOAuth2Authentication("GOOGLE", userInfo);
    }

    @Transactional
    public AuthResponse authenticateWithApple(String identityToken, String fullName) {
        OAuth2TokenVerifier.OAuth2UserInfo userInfo = oAuth2TokenVerifier.verifyAppleToken(identityToken);
        if (userInfo.getName() == null && fullName != null) {
            userInfo.setName(fullName);
        }
        log.info("Apple OAuth authentication: email={}", userInfo.getEmail());
        return handleOAuth2Authentication("APPLE", userInfo);
    }

    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtTokenProvider.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Token refresh failed: email={} (user not found)", email);
                    return new UnauthorizedException("Invalid refresh token");
                });
        log.debug("Token refreshed: email={}", email);
        return buildAuthResponse(user);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return EntityMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        user = userRepository.save(user);
        log.info("Profile updated: email={}", email);
        return EntityMapper.toUserResponse(user);
    }

    private AuthResponse handleOAuth2Authentication(String provider, OAuth2TokenVerifier.OAuth2UserInfo userInfo) {
        User user = userRepository.findByOauthProviderAndOauthProviderId(provider, userInfo.getProviderId())
                .orElseGet(() -> {
                    // Check if user exists by email (link accounts)
                    return userRepository.findByEmail(userInfo.getEmail())
                            .map(existingUser -> {
                                existingUser.setOauthProvider(provider);
                                existingUser.setOauthProviderId(userInfo.getProviderId());
                                if (userInfo.getPictureUrl() != null) {
                                    existingUser.setAvatarUrl(userInfo.getPictureUrl());
                                }
                                return userRepository.save(existingUser);
                            })
                            .orElseGet(() -> {
                                User newUser = User.builder()
                                        .fullName(userInfo.getName() != null ? userInfo.getName() : "User")
                                        .email(userInfo.getEmail())
                                        .oauthProvider(provider)
                                        .oauthProviderId(userInfo.getProviderId())
                                        .avatarUrl(userInfo.getPictureUrl())
                                        .build();
                                return userRepository.save(newUser);
                            });
                });

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .accessToken(jwtTokenProvider.generateToken(user))
                .refreshToken(jwtTokenProvider.generateRefreshToken(user))
                .user(EntityMapper.toUserResponse(user))
                .build();
    }
}
