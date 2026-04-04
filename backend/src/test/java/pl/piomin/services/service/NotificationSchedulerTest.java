package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.entity.Task;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;
import pl.piomin.services.model.enums.TaskPriority;
import pl.piomin.services.repository.ExpenseRepository;
import pl.piomin.services.repository.HiredVendorRepository;
import pl.piomin.services.repository.TaskRepository;
import pl.piomin.services.repository.WorkspaceMemberRepository;
import pl.piomin.services.repository.WorkspaceRepository;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationSchedulerTest {

    @Mock private WorkspaceRepository workspaceRepository;
    @Mock private WorkspaceMemberRepository memberRepository;
    @Mock private TaskRepository taskRepository;
    @Mock private ExpenseRepository expenseRepository;
    @Mock private HiredVendorRepository hiredVendorRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private NotificationScheduler scheduler;

    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder()
                .eventName("Wedding")
                .eventDate(LocalDate.now().plusDays(30))
                .build();
        testWorkspace.setId(1L);
    }

    @Test
    void sendDailyNotifications_shouldNotifyForUpcomingTasks() {
        Task task = Task.builder()
                .title("Book Venue")
                .dueDate(LocalDate.now())
                .priority(TaskPriority.HIGH)
                .isCompleted(false)
                .assignedUsers(new HashSet<>())
                .workspace(testWorkspace)
                .build();
        task.setId(1L);

        when(workspaceRepository.findAll()).thenReturn(List.of(testWorkspace));
        when(taskRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of(task));
        when(expenseRepository.findByWorkspaceIdAndDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());
        when(hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());

        scheduler.sendDailyNotifications();

        verify(notificationService).sendToWorkspace(
                eq(testWorkspace),
                eq("Task due today: Book Venue"),
                anyString(),
                eq(NotificationType.TASK),
                eq(NotificationPriority.HIGH),
                eq("wedding://tasks/1"));
    }

    @Test
    void sendDailyNotifications_shouldSkipCompletedTasks() {
        Task completedTask = Task.builder()
                .title("Done Task")
                .dueDate(LocalDate.now())
                .priority(TaskPriority.LOW)
                .isCompleted(true)
                .assignedUsers(new HashSet<>())
                .workspace(testWorkspace)
                .build();
        completedTask.setId(2L);

        when(workspaceRepository.findAll()).thenReturn(List.of(testWorkspace));
        when(taskRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of(completedTask));
        when(expenseRepository.findByWorkspaceIdAndDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());
        when(hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());

        scheduler.sendDailyNotifications();

        // Should send for countdown (30 days) but NOT for completed task
        verify(notificationService, never()).sendToWorkspace(
                any(), eq("Task due today: Done Task"), anyString(), any(), any(), any());
    }

    @Test
    void sendDailyNotifications_shouldSendCountdownAt30Days() {
        when(workspaceRepository.findAll()).thenReturn(List.of(testWorkspace));
        when(taskRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());
        when(expenseRepository.findByWorkspaceIdAndDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());
        when(hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());

        scheduler.sendDailyNotifications();

        verify(notificationService).sendToWorkspace(
                eq(testWorkspace),
                eq("Wedding Countdown"),
                eq("30 days until your wedding!"),
                eq(NotificationType.EVENT),
                eq(NotificationPriority.MEDIUM),
                eq("wedding://dashboard"));
    }
}
