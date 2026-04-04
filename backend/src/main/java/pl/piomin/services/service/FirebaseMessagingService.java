package pl.piomin.services.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import pl.piomin.services.model.entity.UserDevice;
import pl.piomin.services.repository.UserDeviceRepository;

import java.util.List;

@Service
public class FirebaseMessagingService {

    private static final Logger log = LoggerFactory.getLogger(FirebaseMessagingService.class);

    private final FirebaseMessaging firebaseMessaging;
    private final UserDeviceRepository userDeviceRepository;

    public FirebaseMessagingService(@Nullable FirebaseMessaging firebaseMessaging,
                                    UserDeviceRepository userDeviceRepository) {
        this.firebaseMessaging = firebaseMessaging;
        this.userDeviceRepository = userDeviceRepository;
    }

    /**
     * Send push notification to all active devices of a user.
     * Returns true if at least one message was sent successfully.
     */
    public boolean sendToUser(Long userId, String title, String body, String actionUrl) {
        if (firebaseMessaging == null) {
            log.debug("Firebase not configured, skipping push for user {}", userId);
            return false;
        }

        List<UserDevice> devices = userDeviceRepository.findByUserIdAndIsActiveTrue(userId);
        if (devices.isEmpty()) {
            log.debug("No active devices for user {}", userId);
            return false;
        }

        boolean anySent = false;
        for (UserDevice device : devices) {
            try {
                Message message = Message.builder()
                        .setToken(device.getFcmToken())
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .putData("actionUrl", actionUrl != null ? actionUrl : "")
                        .build();

                String messageId = firebaseMessaging.send(message);
                log.debug("Push sent to device {}: messageId={}", device.getFcmToken(), messageId);
                anySent = true;
            } catch (Exception e) {
                log.warn("Failed to send push to device {}: {}", device.getFcmToken(), e.getMessage());
                // Mark device as inactive if token is invalid
                if (isInvalidTokenError(e)) {
                    device.setActive(false);
                    userDeviceRepository.save(device);
                }
            }
        }

        return anySent;
    }

    private boolean isInvalidTokenError(Exception e) {
        String message = e.getMessage();
        return message != null && (message.contains("NOT_FOUND") || message.contains("INVALID_ARGUMENT")
                || message.contains("UNREGISTERED"));
    }
}
