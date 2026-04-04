package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import pl.piomin.services.model.entity.Notification;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByWorkspaceIdAndUserIdOrderByCreatedAtDesc(Long workspaceId, Long userId);

    List<Notification> findByWorkspaceIdAndUserIdAndTypeOrderByCreatedAtDesc(
            Long workspaceId, Long userId, NotificationType type);

    List<Notification> findByWorkspaceIdAndUserIdAndPriorityOrderByCreatedAtDesc(
            Long workspaceId, Long userId, NotificationPriority priority);

    long countByWorkspaceIdAndUserIdAndIsReadFalse(Long workspaceId, Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.workspace.id = :workspaceId AND n.user.id = :userId AND n.isRead = false")
    int markAllAsRead(Long workspaceId, Long userId);
}
