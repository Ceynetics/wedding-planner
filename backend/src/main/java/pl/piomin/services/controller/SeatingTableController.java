package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.request.HouseholdAssignRequest;
import pl.piomin.services.model.dto.request.PositionUpdateRequest;
import pl.piomin.services.model.dto.request.SeatingTableRequest;
import pl.piomin.services.model.dto.response.HouseholdResponse;
import pl.piomin.services.model.dto.response.SeatingStatsResponse;
import pl.piomin.services.model.dto.response.SeatingTableResponse;
import pl.piomin.services.model.enums.ExportFormat;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.SeatingPlanExportService;
import pl.piomin.services.service.SeatingTableService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/seating-tables")
public class SeatingTableController {

    private final SeatingTableService seatingTableService;
    private final SeatingPlanExportService exportService;
    private final SecurityUtils securityUtils;

    public SeatingTableController(SeatingTableService seatingTableService,
                                   SeatingPlanExportService exportService,
                                   SecurityUtils securityUtils) {
        this.seatingTableService = seatingTableService;
        this.exportService = exportService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<SeatingTableResponse> create(@CurrentUser UserDetails userDetails,
                                                        @PathVariable Long workspaceId,
                                                        @Valid @RequestBody SeatingTableRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(seatingTableService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<SeatingTableResponse>> list(@CurrentUser UserDetails userDetails,
                                                            @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.list(workspaceId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatingTableResponse> getById(@CurrentUser UserDetails userDetails,
                                                         @PathVariable Long workspaceId,
                                                         @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeatingTableResponse> update(@CurrentUser UserDetails userDetails,
                                                        @PathVariable Long workspaceId,
                                                        @PathVariable Long id,
                                                        @Valid @RequestBody SeatingTableRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        seatingTableService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/position")
    public ResponseEntity<SeatingTableResponse> updatePosition(@CurrentUser UserDetails userDetails,
                                                                @PathVariable Long workspaceId,
                                                                @PathVariable Long id,
                                                                @RequestBody PositionUpdateRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.updatePosition(workspaceId, id, request, userId));
    }

    @PostMapping("/{id}/households")
    public ResponseEntity<SeatingTableResponse> assignHouseholds(@CurrentUser UserDetails userDetails,
                                                                   @PathVariable Long workspaceId,
                                                                   @PathVariable Long id,
                                                                   @Valid @RequestBody HouseholdAssignRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.assignHouseholds(workspaceId, id,
                request.getHouseholdIds(), userId));
    }

    @DeleteMapping("/{id}/households/{householdId}")
    public ResponseEntity<Void> unassignHousehold(@CurrentUser UserDetails userDetails,
                                                    @PathVariable Long workspaceId,
                                                    @PathVariable Long id,
                                                    @PathVariable Long householdId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        seatingTableService.unassignHousehold(workspaceId, id, householdId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unassigned-households")
    public ResponseEntity<List<HouseholdResponse>> unassignedHouseholds(@CurrentUser UserDetails userDetails,
                                                                          @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.getUnassignedHouseholds(workspaceId, userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<SeatingStatsResponse> stats(@CurrentUser UserDetails userDetails,
                                                       @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(seatingTableService.getStats(workspaceId, userId));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportFullPlan(@CurrentUser UserDetails userDetails,
                                                  @PathVariable Long workspaceId,
                                                  @RequestParam(defaultValue = "PDF") ExportFormat format) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        byte[] content = exportService.exportFullPlan(workspaceId, format, userId);
        return buildExportResponse(content, format, "seating-plan");
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportSingleTable(@CurrentUser UserDetails userDetails,
                                                     @PathVariable Long workspaceId,
                                                     @PathVariable Long id,
                                                     @RequestParam(defaultValue = "PDF") ExportFormat format) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        byte[] content = exportService.exportSingleTable(workspaceId, id, format, userId);
        return buildExportResponse(content, format, "table-" + id);
    }

    private ResponseEntity<byte[]> buildExportResponse(byte[] content, ExportFormat format, String filename) {
        MediaType mediaType = format == ExportFormat.PDF ? MediaType.APPLICATION_PDF : MediaType.IMAGE_JPEG;
        String ext = format.name().toLowerCase();
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename + "." + ext)
                .body(content);
    }
}
