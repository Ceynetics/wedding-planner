package pl.piomin.services.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.repository.UserRepository;

@Component
public class SecurityUtils {

    private final UserRepository userRepository;

    public SecurityUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserFromDetails(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
