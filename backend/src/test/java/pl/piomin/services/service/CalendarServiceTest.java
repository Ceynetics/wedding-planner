package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.response.CalendarEventResponse;
import pl.piomin.services.model.entity.Expense;
import pl.piomin.services.model.entity.HiredVendor;
import pl.piomin.services.model.entity.Task;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.TaskPriority;
import pl.piomin.services.repository.ExpenseRepository;
import pl.piomin.services.repository.HiredVendorRepository;
import pl.piomin.services.repository.TaskRepository;
import pl.piomin.services.repository.WorkspaceRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CalendarServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private ExpenseRepository expenseRepository;
    @Mock private HiredVendorRepository hiredVendorRepository;
    @Mock private WorkspaceRepository workspaceRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private CalendarService calendarService;

    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder()
                .eventName("Wedding")
                .eventDate(LocalDate.of(2026, 6, 15))
                .build();
        testWorkspace.setId(1L);
    }

    @Test
    void getEventsForMonth_shouldAggregateTasksExpensesAndVendors() {
        YearMonth month = YearMonth.of(2026, 6);

        Task task = Task.builder()
                .title("Final Fitting").dueDate(LocalDate.of(2026, 6, 10))
                .priority(TaskPriority.HIGH).isCompleted(false)
                .assignedUsers(new HashSet<>()).workspace(testWorkspace).build();
        task.setId(1L);

        Expense expense = Expense.builder()
                .title("Venue Deposit").amount(BigDecimal.valueOf(5000))
                .date(LocalDate.of(2026, 6, 5)).isPaid(false).workspace(testWorkspace).build();
        expense.setId(2L);

        HiredVendor vendor = HiredVendor.builder()
                .vendorName("Lumina Studios").totalAmount(BigDecimal.valueOf(3500))
                .dueDate(LocalDate.of(2026, 6, 20)).workspace(testWorkspace).build();
        vendor.setId(3L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(taskRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of(task));
        when(expenseRepository.findByWorkspaceIdAndDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of(expense));
        when(hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of(vendor));
        when(workspaceRepository.findById(1L)).thenReturn(Optional.of(testWorkspace));

        List<CalendarEventResponse> events = calendarService.getEventsForMonth(1L, month, 1L);

        // 1 task + 1 expense + 1 vendor + 1 wedding day = 4 events
        assertEquals(4, events.size());

        // Should be sorted by date
        assertEquals(LocalDate.of(2026, 6, 5), events.get(0).getDate());
        assertEquals("payment", events.get(0).getType());

        assertEquals(LocalDate.of(2026, 6, 10), events.get(1).getDate());
        assertEquals("task", events.get(1).getType());

        assertEquals(LocalDate.of(2026, 6, 15), events.get(2).getDate());
        assertEquals("Wedding Day!", events.get(2).getTitle());

        assertEquals(LocalDate.of(2026, 6, 20), events.get(3).getDate());
    }

    @Test
    void getEventsForMonth_shouldReturnEmptyForMonthWithNoEvents() {
        YearMonth month = YearMonth.of(2026, 1);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(taskRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(expenseRepository.findByWorkspaceIdAndDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(workspaceRepository.findById(1L)).thenReturn(Optional.of(testWorkspace));

        List<CalendarEventResponse> events = calendarService.getEventsForMonth(1L, month, 1L);

        assertTrue(events.isEmpty());
    }

    @Test
    void getEventsForMonth_shouldIncludeWeddingDayInCorrectMonth() {
        YearMonth weddingMonth = YearMonth.of(2026, 6);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(taskRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(expenseRepository.findByWorkspaceIdAndDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(workspaceRepository.findById(1L)).thenReturn(Optional.of(testWorkspace));

        List<CalendarEventResponse> events = calendarService.getEventsForMonth(1L, weddingMonth, 1L);

        assertEquals(1, events.size());
        assertEquals("Wedding Day!", events.get(0).getTitle());
        assertEquals("holiday", events.get(0).getType());
    }
}
