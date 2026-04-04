package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.piomin.services.model.entity.Expense;
import pl.piomin.services.model.entity.HiredVendor;
import pl.piomin.services.model.entity.Task;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.entity.WorkspaceMember;
import pl.piomin.services.model.enums.NotificationPriority;
import pl.piomin.services.model.enums.NotificationType;
import pl.piomin.services.repository.ExpenseRepository;
import pl.piomin.services.repository.HiredVendorRepository;
import pl.piomin.services.repository.TaskRepository;
import pl.piomin.services.repository.WorkspaceMemberRepository;
import pl.piomin.services.repository.WorkspaceRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Component
@EnableScheduling
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);
    private static final Set<Long> COUNTDOWN_MILESTONES = Set.of(90L, 60L, 30L, 14L, 7L, 3L, 1L, 0L);

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final TaskRepository taskRepository;
    private final ExpenseRepository expenseRepository;
    private final HiredVendorRepository hiredVendorRepository;
    private final NotificationService notificationService;

    public NotificationScheduler(WorkspaceRepository workspaceRepository,
                                  WorkspaceMemberRepository memberRepository,
                                  TaskRepository taskRepository,
                                  ExpenseRepository expenseRepository,
                                  HiredVendorRepository hiredVendorRepository,
                                  NotificationService notificationService) {
        this.workspaceRepository = workspaceRepository;
        this.memberRepository = memberRepository;
        this.taskRepository = taskRepository;
        this.expenseRepository = expenseRepository;
        this.hiredVendorRepository = hiredVendorRepository;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 8 * * *") // Every day at 8 AM
    public void sendDailyNotifications() {
        log.info("Running daily notification scheduler");
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        List<Workspace> workspaces = workspaceRepository.findAll();
        for (Workspace workspace : workspaces) {
            checkUpcomingTasks(workspace, today, tomorrow);
            checkUpcomingPayments(workspace, today, tomorrow);
            checkVendorDueDates(workspace, today, tomorrow);
            checkWeddingCountdown(workspace, today);
        }
    }

    private void checkUpcomingTasks(Workspace workspace, LocalDate today, LocalDate tomorrow) {
        // Tasks due today or tomorrow
        List<Task> upcomingTasks = taskRepository.findByWorkspaceIdAndDueDateBetween(
                workspace.getId(), today, tomorrow);

        for (Task task : upcomingTasks) {
            if (task.isCompleted()) continue;

            String timeFrame = task.getDueDate().equals(today) ? "today" : "tomorrow";
            notificationService.sendToWorkspace(workspace,
                    "Task due " + timeFrame + ": " + task.getTitle(),
                    task.getTitle() + " is due " + timeFrame + ". Don't forget to complete it!",
                    NotificationType.TASK,
                    NotificationPriority.HIGH,
                    "wedding://tasks/" + task.getId());
        }
    }

    private void checkUpcomingPayments(Workspace workspace, LocalDate today, LocalDate threeDaysOut) {
        LocalDate threedays = today.plusDays(3);
        List<Expense> upcomingExpenses = expenseRepository.findByWorkspaceIdAndDateBetween(
                workspace.getId(), today, threedays);

        for (Expense expense : upcomingExpenses) {
            if (expense.isPaid()) continue;

            long daysUntil = ChronoUnit.DAYS.between(today, expense.getDate());
            String timeFrame = daysUntil == 0 ? "today" : "in " + daysUntil + " day(s)";
            notificationService.sendToWorkspace(workspace,
                    "Payment due " + timeFrame,
                    expense.getTitle() + " - $" + expense.getAmount() + " is due " + timeFrame,
                    NotificationType.PAYMENT,
                    NotificationPriority.HIGH,
                    "wedding://expenses/" + expense.getId());
        }
    }

    private void checkVendorDueDates(Workspace workspace, LocalDate today, LocalDate tomorrow) {
        List<HiredVendor> upcomingVendors = hiredVendorRepository.findByWorkspaceIdAndDueDateBetween(
                workspace.getId(), today, today.plusDays(3));

        for (HiredVendor hv : upcomingVendors) {
            long daysUntil = ChronoUnit.DAYS.between(today, hv.getDueDate());
            String timeFrame = daysUntil == 0 ? "today" : "in " + daysUntil + " day(s)";
            notificationService.sendToWorkspace(workspace,
                    "Vendor payment due " + timeFrame,
                    hv.getVendorName() + " payment of $" + hv.getTotalAmount() + " is due " + timeFrame,
                    NotificationType.PAYMENT,
                    NotificationPriority.HIGH,
                    "wedding://vendors/" + hv.getId());
        }
    }

    private void checkWeddingCountdown(Workspace workspace, LocalDate today) {
        if (workspace.getEventDate() == null || workspace.getEventDate().isBefore(today)) return;

        long daysUntil = ChronoUnit.DAYS.between(today, workspace.getEventDate());

        if (COUNTDOWN_MILESTONES.contains(daysUntil)) {
            String message = daysUntil == 0
                    ? "Today is the big day! Congratulations!"
                    : daysUntil + " days until your wedding!";

            NotificationPriority priority = daysUntil <= 7
                    ? NotificationPriority.HIGH
                    : NotificationPriority.MEDIUM;

            notificationService.sendToWorkspace(workspace,
                    "Wedding Countdown",
                    message,
                    NotificationType.EVENT,
                    priority,
                    "wedding://dashboard");
        }
    }
}
