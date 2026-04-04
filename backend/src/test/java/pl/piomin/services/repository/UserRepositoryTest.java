package pl.piomin.services.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.enums.Gender;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("wedding_planner_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_shouldReturnUserWhenExists() {
        User user = User.builder()
                .fullName("Test User")
                .email("test@example.com")
                .password("encoded-pwd")
                .gender(Gender.MALE)
                .age(30)
                .build();
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertTrue(found.isPresent());
        assertEquals("Test User", found.get().getFullName());
    }

    @Test
    void findByEmail_shouldReturnEmptyWhenNotExists() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        assertFalse(found.isPresent());
    }

    @Test
    void existsByEmail_shouldReturnTrueWhenExists() {
        User user = User.builder()
                .fullName("Test User")
                .email("exists@example.com")
                .password("encoded-pwd")
                .build();
        userRepository.save(user);

        assertTrue(userRepository.existsByEmail("exists@example.com"));
    }

    @Test
    void existsByEmail_shouldReturnFalseWhenNotExists() {
        assertFalse(userRepository.existsByEmail("notexists@example.com"));
    }

    @Test
    void findByOauthProviderAndProviderId_shouldReturnUser() {
        User user = User.builder()
                .fullName("OAuth User")
                .email("oauth@example.com")
                .oauthProvider("GOOGLE")
                .oauthProviderId("google-123")
                .build();
        userRepository.save(user);

        Optional<User> found = userRepository.findByOauthProviderAndOauthProviderId("GOOGLE", "google-123");

        assertTrue(found.isPresent());
        assertEquals("OAuth User", found.get().getFullName());
    }
}
