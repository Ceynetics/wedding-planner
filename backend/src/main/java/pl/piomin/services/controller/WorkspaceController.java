package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.request.InviteRequest;
import pl.piomin.services.model.dto.request.JoinRequest;
import pl.piomin.services.model.dto.request.WorkspaceRequest;
import pl.piomin.services.model.dto.response.WorkspaceResponse;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.WorkspaceService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final SecurityUtils securityUtils;

    public WorkspaceController(WorkspaceService workspaceService, SecurityUtils securityUtils) {
        this.workspaceService = workspaceService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<WorkspaceResponse> create(@CurrentUser UserDetails userDetails,
                                                     @Valid @RequestBody WorkspaceRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(workspaceService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> list(@CurrentUser UserDetails userDetails) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(workspaceService.listForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponse> getById(@CurrentUser UserDetails userDetails,
                                                      @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(workspaceService.getById(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkspaceResponse> update(@CurrentUser UserDetails userDetails,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody WorkspaceRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(workspaceService.update(id, request, userId));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<Void> invite(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long id,
                                        @Valid @RequestBody InviteRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        workspaceService.invite(id, request, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/join")
    public ResponseEntity<WorkspaceResponse> join(@CurrentUser UserDetails userDetails,
                                                   @Valid @RequestBody JoinRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(workspaceService.joinByPairingCode(request.getPairingCode(), userId));
    }
}
