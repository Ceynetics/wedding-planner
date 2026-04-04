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
import pl.piomin.services.model.dto.request.HouseholdRequest;
import pl.piomin.services.model.dto.response.HouseholdResponse;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.HouseholdService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/households")
public class HouseholdController {

    private final HouseholdService householdService;
    private final SecurityUtils securityUtils;

    public HouseholdController(HouseholdService householdService, SecurityUtils securityUtils) {
        this.householdService = householdService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<HouseholdResponse> create(@CurrentUser UserDetails userDetails,
                                                     @PathVariable Long workspaceId,
                                                     @Valid @RequestBody HouseholdRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(householdService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<HouseholdResponse>> list(@CurrentUser UserDetails userDetails,
                                                         @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(householdService.listByWorkspace(workspaceId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseholdResponse> getById(@CurrentUser UserDetails userDetails,
                                                      @PathVariable Long workspaceId,
                                                      @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(householdService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HouseholdResponse> update(@CurrentUser UserDetails userDetails,
                                                     @PathVariable Long workspaceId,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody HouseholdRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(householdService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        householdService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<HouseholdResponse>> getUnassigned(@CurrentUser UserDetails userDetails,
                                                                   @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(householdService.getUnassigned(workspaceId, userId));
    }
}
