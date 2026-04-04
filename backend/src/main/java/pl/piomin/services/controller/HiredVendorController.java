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
import pl.piomin.services.model.dto.request.HiredVendorRequest;
import pl.piomin.services.model.dto.response.HiredVendorResponse;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.HiredVendorService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/vendors")
public class HiredVendorController {

    private final HiredVendorService hiredVendorService;
    private final SecurityUtils securityUtils;

    public HiredVendorController(HiredVendorService hiredVendorService, SecurityUtils securityUtils) {
        this.hiredVendorService = hiredVendorService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<HiredVendorResponse> create(@CurrentUser UserDetails userDetails,
                                                       @PathVariable Long workspaceId,
                                                       @Valid @RequestBody HiredVendorRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hiredVendorService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<HiredVendorResponse>> list(@CurrentUser UserDetails userDetails,
                                                           @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(hiredVendorService.list(workspaceId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HiredVendorResponse> getById(@CurrentUser UserDetails userDetails,
                                                        @PathVariable Long workspaceId,
                                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(hiredVendorService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HiredVendorResponse> update(@CurrentUser UserDetails userDetails,
                                                       @PathVariable Long workspaceId,
                                                       @PathVariable Long id,
                                                       @Valid @RequestBody HiredVendorRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(hiredVendorService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        hiredVendorService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }
}
