package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.ExpenseRequest;
import pl.piomin.services.model.dto.response.BudgetSummaryResponse;
import pl.piomin.services.model.dto.response.ExpenseResponse;
import pl.piomin.services.model.entity.Expense;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.repository.ExpenseRepository;
import pl.piomin.services.repository.WorkspaceRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private static final Logger log = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public ExpenseService(ExpenseRepository expenseRepository,
                          WorkspaceRepository workspaceRepository,
                          WorkspaceAuthorizationService authorizationService) {
        this.expenseRepository = expenseRepository;
        this.workspaceRepository = workspaceRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public ExpenseResponse create(Long workspaceId, ExpenseRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .paidBy(request.getPaidBy())
                .isPaid(request.isPaid())
                .splitEnabled(request.isSplitEnabled())
                .notes(request.getNotes())
                .date(request.getDate())
                .workspace(workspace)
                .build();

        expense = expenseRepository.save(expense);
        log.info("Expense created: id={}, workspaceId={}, amount={}", expense.getId(), workspaceId, expense.getAmount());
        return toResponse(expense);
    }

    public List<ExpenseResponse> list(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Listing expenses: workspaceId={}", workspaceId);
        return expenseRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ExpenseResponse getById(Long workspaceId, Long expenseId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Expense expense = findExpenseInWorkspace(workspaceId, expenseId);
        return toResponse(expense);
    }

    @Transactional
    public ExpenseResponse update(Long workspaceId, Long expenseId, ExpenseRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Expense expense = findExpenseInWorkspace(workspaceId, expenseId);

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setPaidBy(request.getPaidBy());
        expense.setPaid(request.isPaid());
        expense.setSplitEnabled(request.isSplitEnabled());
        expense.setNotes(request.getNotes());
        expense.setDate(request.getDate());

        expense = expenseRepository.save(expense);
        log.info("Expense updated: id={}, workspaceId={}", expense.getId(), workspaceId);
        return toResponse(expense);
    }

    @Transactional
    public void delete(Long workspaceId, Long expenseId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        Expense expense = findExpenseInWorkspace(workspaceId, expenseId);
        expenseRepository.delete(expense);
        log.info("Expense deleted: id={}, workspaceId={}", expenseId, workspaceId);
    }

    public BudgetSummaryResponse getSummary(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Fetching budget summary: workspaceId={}", workspaceId);
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        List<Expense> expenses = expenseRepository.findByWorkspaceId(workspaceId);

        BigDecimal totalSpent = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalBudget = workspace.getBudget() != null ? workspace.getBudget() : BigDecimal.ZERO;
        BigDecimal remaining = totalBudget.subtract(totalSpent);

        Map<String, List<Expense>> byCategory = expenses.stream()
                .filter(e -> e.getCategory() != null)
                .collect(Collectors.groupingBy(e -> e.getCategory().name()));

        List<BudgetSummaryResponse.CategoryBreakdown> categoryBreakdowns = byCategory.entrySet().stream()
                .map(entry -> BudgetSummaryResponse.CategoryBreakdown.builder()
                        .category(entry.getKey())
                        .total(entry.getValue().stream()
                                .map(Expense::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add))
                        .count(entry.getValue().size())
                        .build())
                .toList();

        return BudgetSummaryResponse.builder()
                .totalBudget(totalBudget)
                .totalSpent(totalSpent)
                .remaining(remaining)
                .paidCount(expenses.stream().filter(Expense::isPaid).count())
                .unpaidCount(expenses.stream().filter(e -> !e.isPaid()).count())
                .byCategory(categoryBreakdowns)
                .build();
    }

    private Expense findExpenseInWorkspace(Long workspaceId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!expense.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Expense not found in this workspace");
        }
        return expense;
    }

    private ExpenseResponse toResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .paidBy(expense.getPaidBy())
                .isPaid(expense.isPaid())
                .splitEnabled(expense.isSplitEnabled())
                .notes(expense.getNotes())
                .date(expense.getDate())
                .build();
    }
}
