package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.response.NotificationResponse;
import pl.piomin.services.model.entity.Notification;
import pl.piomin.services.model.entity.User;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;
import pl.piomin.services.repository.NotificationRepository;
import pl.piomin.services.repository.WorkspaceMemberRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private NotificationRepository notificationRepository;
    @Mock private WorkspaceMemberRepository memberRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;
    @Mock private FirebaseMessagingService firebaseMessagingService;

    @InjectMocks
    private NotificationService notificationService;

    private Workspace testWorkspace;
    private User testUser;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);

        testUser = User.builder().fullName("Test User").email("test@example.com").build();
        testUser.setId(1L);
    }

    @Test
    void send_shouldSaveNotificationAndAttemptPush() {
        Notification saved = Notification.builder()
                .title("Test").description("Desc")
                .type(NotificationType.TASK).priority(NotificationPriority.HIGH)
                .workspace(testWorkspace).user(testUser)
                .build();
        saved.setId(1L);

        when(notificationRepository.save(any(Notification.class))).thenReturn(saved);
        when(firebaseMessagingService.sendToUser(1L, "Test", "Desc", null)).thenReturn(false);

        notificationService.send(testWorkspace, testUser, "Test", "Desc",
                NotificationType.TASK, NotificationPriority.HIGH, null);

        verify(notificationRepository).save(any(Notification.class));
        verify(firebaseMessagingService).sendToUser(1L, "Test", "Desc", null);
    }

    @Test
    void list_shouldReturnNotifications() {
        Notification n1 = Notification.builder()
                .title("Task due").description("Book hotel is due tomorrow")
                .type(NotificationType.TASK).priority(NotificationPriority.HIGH)
                .workspace(testWorkspace).user(testUser).build();
        n1.setId(1L);

        Notification n2 = Notification.builder()
                .title("RSVP update").description("John confirmed")
                .type(NotificationType.RSVP).priority(NotificationPriority.MEDIUM)
                .workspace(testWorkspace).user(testUser).build();
        n2.setId(2L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(notificationRepository.findByWorkspaceIdAndUserIdOrderByCreatedAtDesc(1L, 1L))
                .thenReturn(List.of(n1, n2));

        List<NotificationResponse> result = notificationService.list(1L, 1L, null, null);

        assertEquals(2, result.size());
        assertEquals("Task due", result.get(0).getTitle());
    }

    @Test
    void list_shouldFilterByType() {
        Notification n1 = Notification.builder()
                .title("Task due").type(NotificationType.TASK).priority(NotificationPriority.HIGH)
                .workspace(testWorkspace).user(testUser).build();
        n1.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(notificationRepository.findByWorkspaceIdAndUserIdAndTypeOrderByCreatedAtDesc(
                1L, 1L, NotificationType.TASK)).thenReturn(List.of(n1));

        List<NotificationResponse> result = notificationService.list(1L, 1L, NotificationType.TASK, null);

        assertEquals(1, result.size());
        assertEquals(NotificationType.TASK, result.get(0).getType());
    }

    @Test
    void markAsRead_shouldSetReadTrue() {
        Notification n = Notification.builder()
                .title("Test").type(NotificationType.SYSTEM).priority(NotificationPriority.LOW)
                .isRead(false).workspace(testWorkspace).user(testUser).build();
        n.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        NotificationResponse result = notificationService.markAsRead(1L, 1L, 1L);

        assertTrue(result.isRead());
    }

    @Test
    void getUnreadCount_shouldReturnCorrectCount() {
        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(notificationRepository.countByWorkspaceIdAndUserIdAndIsReadFalse(1L, 1L)).thenReturn(5L);

        long count = notificationService.getUnreadCount(1L, 1L);

        assertEquals(5, count);
    }

    @Test
    void markAllAsRead_shouldCallRepository() {
        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(notificationRepository.markAllAsRead(1L, 1L)).thenReturn(3);

        notificationService.markAllAsRead(1L, 1L);

        verify(notificationRepository).markAllAsRead(1L, 1L);
    }
}
