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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.request.GuestRequest;
import pl.piomin.services.model.dto.response.GuestResponse;
import pl.piomin.services.model.dto.response.GuestStatsResponse;
import pl.piomin.services.model.enums.GuestCategory;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.GuestService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/guests")
public class GuestController {

    private final GuestService guestService;
    private final SecurityUtils securityUtils;

    public GuestController(GuestService guestService, SecurityUtils securityUtils) {
        this.guestService = guestService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<GuestResponse> create(@CurrentUser UserDetails userDetails,
                                                 @PathVariable Long workspaceId,
                                                 @Valid @RequestBody GuestRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(guestService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<GuestResponse>> list(@CurrentUser UserDetails userDetails,
                                                     @PathVariable Long workspaceId,
                                                     @RequestParam(required = false) GuestStatus status,
                                                     @RequestParam(required = false) GuestSide side,
                                                     @RequestParam(required = false) GuestCategory category,
                                                     @RequestParam(required = false) Long householdId,
                                                     @RequestParam(required = false) String search) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(guestService.list(workspaceId, userId, status, side, category, householdId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestResponse> getById(@CurrentUser UserDetails userDetails,
                                                  @PathVariable Long workspaceId,
                                                  @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(guestService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestResponse> update(@CurrentUser UserDetails userDetails,
                                                 @PathVariable Long workspaceId,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody GuestRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(guestService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        guestService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<GuestStatsResponse> stats(@CurrentUser UserDetails userDetails,
                                                     @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(guestService.getStats(workspaceId, userId));
    }
}
