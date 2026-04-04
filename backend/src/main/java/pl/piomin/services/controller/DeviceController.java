package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.DeviceRegistrationRequest;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.entity.UserDevice;
import pl.piomin.services.repository.UserDeviceRepository;
import pl.piomin.services.repository.UserRepository;
import pl.piomin.services.security.CurrentUser;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final UserDeviceRepository userDeviceRepository;
    private final UserRepository userRepository;

    public DeviceController(UserDeviceRepository userDeviceRepository, UserRepository userRepository) {
        this.userDeviceRepository = userDeviceRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Void> registerDevice(@CurrentUser UserDetails userDetails,
                                                @Valid @RequestBody DeviceRegistrationRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update existing token or create new
        UserDevice device = userDeviceRepository.findByFcmToken(request.getFcmToken())
                .map(existing -> {
                    existing.setUser(user);
                    existing.setDeviceType(request.getDeviceType());
                    existing.setDeviceName(request.getDeviceName());
                    existing.setActive(true);
                    return existing;
                })
                .orElse(UserDevice.builder()
                        .fcmToken(request.getFcmToken())
                        .deviceType(request.getDeviceType())
                        .deviceName(request.getDeviceName())
                        .isActive(true)
                        .user(user)
                        .build());

        userDeviceRepository.save(device);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<Void> unregisterDevice(@PathVariable String token) {
        userDeviceRepository.deleteByFcmToken(token);
        return ResponseEntity.noContent().build();
    }
}
