package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.request.ExpenseRequest;
import pl.piomin.services.model.dto.response.BudgetSummaryResponse;
import pl.piomin.services.model.dto.response.ExpenseResponse;
import pl.piomin.services.model.entity.Expense;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.ExpenseCategory;
import pl.piomin.services.model.enums.Payer;
import pl.piomin.services.repository.ExpenseRepository;
import pl.piomin.services.repository.WorkspaceRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock private ExpenseRepository expenseRepository;
    @Mock private WorkspaceRepository workspaceRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private ExpenseService expenseService;

    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder()
                .eventName("Wedding")
                .budget(BigDecimal.valueOf(50000))
                .build();
        testWorkspace.setId(1L);
    }

    @Test
    void create_shouldCreateExpense() {
        ExpenseRequest request = ExpenseRequest.builder()
                .title("Venue Deposit")
                .amount(BigDecimal.valueOf(10000))
                .category(ExpenseCategory.VENUE)
                .paidBy(Payer.ME)
                .isPaid(true)
                .date(LocalDate.of(2026, 3, 15))
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);

        Expense saved = Expense.builder()
                .title("Venue Deposit").amount(BigDecimal.valueOf(10000))
                .category(ExpenseCategory.VENUE).paidBy(Payer.ME).isPaid(true)
                .date(LocalDate.of(2026, 3, 15)).workspace(testWorkspace)
                .build();
        saved.setId(1L);

        when(expenseRepository.save(any(Expense.class))).thenReturn(saved);

        ExpenseResponse response = expenseService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Venue Deposit", response.getTitle());
        assertEquals(BigDecimal.valueOf(10000), response.getAmount());
    }

    @Test
    void getSummary_shouldCalculateCorrectTotals() {
        Expense e1 = Expense.builder().title("E1").amount(BigDecimal.valueOf(10000))
                .category(ExpenseCategory.VENUE).isPaid(true).workspace(testWorkspace).build();
        Expense e2 = Expense.builder().title("E2").amount(BigDecimal.valueOf(5000))
                .category(ExpenseCategory.FOOD).isPaid(false).workspace(testWorkspace).build();
        Expense e3 = Expense.builder().title("E3").amount(BigDecimal.valueOf(3000))
                .category(ExpenseCategory.VENUE).isPaid(true).workspace(testWorkspace).build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(workspaceRepository.findById(1L)).thenReturn(Optional.of(testWorkspace));
        when(expenseRepository.findByWorkspaceId(1L)).thenReturn(List.of(e1, e2, e3));

        BudgetSummaryResponse summary = expenseService.getSummary(1L, 1L);

        assertEquals(BigDecimal.valueOf(50000), summary.getTotalBudget());
        assertEquals(0, BigDecimal.valueOf(18000).compareTo(summary.getTotalSpent()));
        assertEquals(0, BigDecimal.valueOf(32000).compareTo(summary.getRemaining()));
        assertEquals(2, summary.getPaidCount());
        assertEquals(1, summary.getUnpaidCount());
        assertEquals(2, summary.getByCategory().size());
    }

    @Test
    void getSummary_shouldHandleNullBudget() {
        testWorkspace.setBudget(null);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(workspaceRepository.findById(1L)).thenReturn(Optional.of(testWorkspace));
        when(expenseRepository.findByWorkspaceId(1L)).thenReturn(List.of());

        BudgetSummaryResponse summary = expenseService.getSummary(1L, 1L);

        assertEquals(BigDecimal.ZERO, summary.getTotalBudget());
        assertEquals(BigDecimal.ZERO, summary.getTotalSpent());
    }

    @Test
    void list_shouldReturnAllExpenses() {
        Expense e1 = Expense.builder().title("E1").amount(BigDecimal.valueOf(1000))
                .workspace(testWorkspace).build();
        e1.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(expenseRepository.findByWorkspaceId(1L)).thenReturn(List.of(e1));

        List<ExpenseResponse> result = expenseService.list(1L, 1L);

        assertEquals(1, result.size());
        assertEquals("E1", result.get(0).getTitle());
    }
}
