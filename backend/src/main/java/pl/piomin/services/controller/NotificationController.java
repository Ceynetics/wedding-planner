package pl.piomin.services.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.response.NotificationResponse;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.NotificationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    public NotificationController(NotificationService notificationService, SecurityUtils securityUtils) {
        this.notificationService = notificationService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list(@CurrentUser UserDetails userDetails,
                                                            @PathVariable Long workspaceId,
                                                            @RequestParam(required = false) NotificationType type,
                                                            @RequestParam(required = false) NotificationPriority priority) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(notificationService.list(workspaceId, userId, type, priority));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@CurrentUser UserDetails userDetails,
                                                            @PathVariable Long workspaceId,
                                                            @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(notificationService.markAsRead(workspaceId, id, userId));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@CurrentUser UserDetails userDetails,
                                               @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        notificationService.markAllAsRead(workspaceId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@CurrentUser UserDetails userDetails,
                                                          @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        long count = notificationService.getUnreadCount(workspaceId, userId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
