package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.response.NotificationResponse;
import pl.piomin.services.model.entity.Notification;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;
import pl.piomin.services.repository.NotificationRepository;
import pl.piomin.services.repository.WorkspaceMemberRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final WorkspaceAuthorizationService authorizationService;
    private final FirebaseMessagingService firebaseMessagingService;

    public NotificationService(NotificationRepository notificationRepository,
                               WorkspaceMemberRepository memberRepository,
                               WorkspaceAuthorizationService authorizationService,
                               FirebaseMessagingService firebaseMessagingService) {
        this.notificationRepository = notificationRepository;
        this.memberRepository = memberRepository;
        this.authorizationService = authorizationService;
        this.firebaseMessagingService = firebaseMessagingService;
    }

    /**
     * Create and send a notification to a specific user in a workspace.
     */
    @Transactional
    public void send(Workspace workspace, User user, String title, String description,
                     NotificationType type, NotificationPriority priority, String actionUrl) {
        Notification notification = Notification.builder()
                .title(title)
                .description(description)
                .type(type)
                .priority(priority)
                .actionUrl(actionUrl)
                .workspace(workspace)
                .user(user)
                .build();

        notification = notificationRepository.save(notification);
        log.info("Notification sent: userId={}, workspaceId={}, type={}, title={}", user.getId(), workspace.getId(), type, title);

        // Send push notification asynchronously
        boolean pushSent = firebaseMessagingService.sendToUser(user.getId(), title, description, actionUrl);
        if (pushSent) {
            notification.setPushSent(true);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    /**
     * Send a notification to ALL members of a workspace.
     */
    @Transactional
    public void sendToWorkspace(Workspace workspace, String title, String description,
                                 NotificationType type, NotificationPriority priority, String actionUrl) {
        memberRepository.findByWorkspaceId(workspace.getId()).forEach(member -> {
            send(workspace, member.getUser(), title, description, type, priority, actionUrl);
        });
    }

    public List<NotificationResponse> list(Long workspaceId, Long userId,
                                            NotificationType type, NotificationPriority priority) {
        authorizationService.validateMembership(workspaceId, userId);

        log.debug("Listing notifications: workspaceId={}, userId={}, type={}, priority={}", workspaceId, userId, type, priority);
        List<Notification> notifications;
        if (type != null) {
            notifications = notificationRepository.findByWorkspaceIdAndUserIdAndTypeOrderByCreatedAtDesc(
                    workspaceId, userId, type);
        } else if (priority != null) {
            notifications = notificationRepository.findByWorkspaceIdAndUserIdAndPriorityOrderByCreatedAtDesc(
                    workspaceId, userId, priority);
        } else {
            notifications = notificationRepository.findByWorkspaceIdAndUserIdOrderByCreatedAtDesc(
                    workspaceId, userId);
        }

        return notifications.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long workspaceId, Long notificationId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setRead(true);
        notification = notificationRepository.save(notification);
        log.debug("Notification marked as read: id={}, userId={}", notificationId, userId);
        return toResponse(notification);
    }

    @Transactional
    public void markAllAsRead(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        notificationRepository.markAllAsRead(workspaceId, userId);
        log.debug("All notifications marked as read: workspaceId={}, userId={}", workspaceId, userId);
    }

    public long getUnreadCount(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        return notificationRepository.countByWorkspaceIdAndUserIdAndIsReadFalse(workspaceId, userId);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .description(n.getDescription())
                .type(n.getType())
                .priority(n.getPriority())
                .actionUrl(n.getActionUrl())
                .imageUrl(n.getImageUrl())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
