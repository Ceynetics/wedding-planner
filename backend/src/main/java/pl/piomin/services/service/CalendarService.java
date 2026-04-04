package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.piomin.services.model.dto.response.CalendarEventResponse;
import pl.piomin.services.model.entity.Expense;
import pl.piomin.services.model.entity.HiredVendor;
import pl.piomin.services.model.entity.Task;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.repository.ExpenseRepository;
import pl.piomin.services.repository.HiredVendorRepository;
import pl.piomin.services.repository.TaskRepository;
import pl.piomin.services.repository.WorkspaceRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class CalendarService {

    private static final Logger log = LoggerFactory.getLogger(CalendarService.class);

    private final TaskRepository taskRepository;
    private final ExpenseRepository expenseRepository;
    private final HiredVendorRepository hiredVendorRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public CalendarService(TaskRepository taskRepository, ExpenseRepository expenseRepository,
                           HiredVendorRepository hiredVendorRepository,
                           WorkspaceRepository workspaceRepository,
                           WorkspaceAuthorizationService authorizationService) {
        this.taskRepository = taskRepository;
        this.expenseRepository = expenseRepository;
        this.hiredVendorRepository = hiredVendorRepository;
        this.workspaceRepository = workspaceRepository;
        this.authorizationService = authorizationService;
    }

    public List<CalendarEventResponse> getEventsForMonth(Long workspaceId, YearMonth month, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Fetching calendar events: workspaceId={}, month={}", workspaceId, month);

        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        List<CalendarEventResponse> events = new ArrayList<>();

        // Tasks with due dates in this month
        List<Task> tasks = taskRepository.findByWorkspaceIdAndDueDateBetween(workspaceId, start, end);
        for (Task task : tasks) {
            events.add(CalendarEventResponse.builder()
                    .date(task.getDueDate())
                    .title(task.getTitle())
                    .type("task")
                    .referenceId(task.getId())
                    .status(task.isCompleted() ? "Completed" : "Pending")
                    .build());
        }

        // Expenses with dates in this month
        List<Expense> expenses = expenseRepository.findByWorkspaceIdAndDateBetween(workspaceId, start, end);
        for (Expense expense : expenses) {
            events.add(CalendarEventResponse.builder()
                    .date(expense.getDate())
                    .title(expense.getTitle())
                    .type("payment")
                    .referenceId(expense.getId())
                    .status(expense.isPaid() ? "Paid" : "Pending")
                    .amount("$" + expense.getAmount())
                    .build());
        }

        // Hired vendor due dates in this month
        List<HiredVendor> vendors = hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(
                workspaceId, start, end);
        for (HiredVendor hv : vendors) {
            events.add(CalendarEventResponse.builder()
                    .date(hv.getDueDate())
                    .title(hv.getVendorName() + " payment")
                    .type("payment")
                    .referenceId(hv.getId())
                    .amount("$" + hv.getTotalAmount())
                    .build());
        }

        // Wedding date if it falls in this month
        Workspace workspace = workspaceRepository.findById(workspaceId).orElse(null);
        if (workspace != null && workspace.getEventDate() != null
                && !workspace.getEventDate().isBefore(start) && !workspace.getEventDate().isAfter(end)) {
            events.add(CalendarEventResponse.builder()
                    .date(workspace.getEventDate())
                    .title("Wedding Day!")
                    .type("holiday")
                    .build());
        }

        events.sort(Comparator.comparing(CalendarEventResponse::getDate));
        log.debug("Calendar events fetched: workspaceId={}, month={}, count={}", workspaceId, month, events.size());
        return events;
    }
}
