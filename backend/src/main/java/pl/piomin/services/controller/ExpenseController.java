package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.request.ExpenseRequest;
import pl.piomin.services.model.dto.response.BudgetSummaryResponse;
import pl.piomin.services.model.dto.response.ExpenseResponse;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.ExpenseService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final SecurityUtils securityUtils;

    public ExpenseController(ExpenseService expenseService, SecurityUtils securityUtils) {
        this.expenseService = expenseService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@CurrentUser UserDetails userDetails,
                                                   @PathVariable Long workspaceId,
                                                   @Valid @RequestBody ExpenseRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> list(@CurrentUser UserDetails userDetails,
                                                       @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(expenseService.list(workspaceId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@CurrentUser UserDetails userDetails,
                                                    @PathVariable Long workspaceId,
                                                    @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(expenseService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@CurrentUser UserDetails userDetails,
                                                   @PathVariable Long workspaceId,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody ExpenseRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(expenseService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        expenseService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<BudgetSummaryResponse> summary(@CurrentUser UserDetails userDetails,
                                                          @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(expenseService.getSummary(workspaceId, userId));
    }
}
