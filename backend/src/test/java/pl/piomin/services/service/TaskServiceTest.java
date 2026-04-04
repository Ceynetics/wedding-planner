package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.request.TaskRequest;
import pl.piomin.services.model.dto.response.TaskResponse;
import pl.piomin.services.model.dto.response.TaskStatsResponse;
import pl.piomin.services.model.entity.Task;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.TaskCategory;
import pl.piomin.services.model.enums.TaskPriority;
import pl.piomin.services.repository.TaskRepository;
import pl.piomin.services.repository.UserRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private UserRepository userRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private TaskService taskService;

    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);
    }

    @Test
    void create_shouldCreateTask() {
        TaskRequest request = TaskRequest.builder()
                .title("Book Venue")
                .dueDate(LocalDate.of(2026, 5, 1))
                .category(TaskCategory.VENUE)
                .priority(TaskPriority.HIGH)
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);

        Task saved = Task.builder()
                .title("Book Venue").dueDate(LocalDate.of(2026, 5, 1))
                .category(TaskCategory.VENUE).priority(TaskPriority.HIGH)
                .assignedUsers(new HashSet<>()).workspace(testWorkspace)
                .build();
        saved.setId(1L);

        when(taskRepository.save(any(Task.class))).thenReturn(saved);

        TaskResponse response = taskService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Book Venue", response.getTitle());
        assertEquals(TaskPriority.HIGH, response.getPriority());
    }

    @Test
    void toggleComplete_shouldFlipStatus() {
        Task task = Task.builder()
                .title("Book Venue").priority(TaskPriority.HIGH)
                .isCompleted(false).assignedUsers(new HashSet<>()).workspace(testWorkspace)
                .build();
        task.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse response = taskService.toggleComplete(1L, 1L, 1L);

        assertTrue(response.isCompleted());
    }

    @Test
    void toggleComplete_shouldFlipBackToIncomplete() {
        Task task = Task.builder()
                .title("Book Venue").priority(TaskPriority.HIGH)
                .isCompleted(true).assignedUsers(new HashSet<>()).workspace(testWorkspace)
                .build();
        task.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse response = taskService.toggleComplete(1L, 1L, 1L);

        assertFalse(response.isCompleted());
    }

    @Test
    void getStats_shouldReturnCorrectCounts() {
        Task t1 = Task.builder().title("T1").priority(TaskPriority.HIGH).category(TaskCategory.VENUE)
                .isCompleted(true).assignedUsers(new HashSet<>()).workspace(testWorkspace).build();
        Task t2 = Task.builder().title("T2").priority(TaskPriority.MEDIUM).category(TaskCategory.FOOD)
                .isCompleted(false).assignedUsers(new HashSet<>()).workspace(testWorkspace).build();
        Task t3 = Task.builder().title("T3").priority(TaskPriority.HIGH).category(TaskCategory.VENUE)
                .isCompleted(false).assignedUsers(new HashSet<>()).workspace(testWorkspace).build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(taskRepository.findByWorkspaceId(1L)).thenReturn(List.of(t1, t2, t3));

        TaskStatsResponse stats = taskService.getStats(1L, 1L);

        assertEquals(3, stats.getTotal());
        assertEquals(1, stats.getCompleted());
        assertEquals(2, stats.getPending());
        assertEquals(2L, stats.getByCategory().get("VENUE"));
        assertEquals(1L, stats.getByCategory().get("FOOD"));
        assertEquals(2L, stats.getByPriority().get("HIGH"));
    }
}
