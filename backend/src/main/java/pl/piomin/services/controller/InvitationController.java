package pl.piomin.services.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import pl.piomin.services.model.dto.request.InvitationRequest;
import pl.piomin.services.model.dto.response.InvitationResponse;
import pl.piomin.services.model.dto.response.TemplateResponse;
import pl.piomin.services.model.enums.ExportFormat;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.InvitationService;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/invitations")
public class InvitationController {

    private final InvitationService invitationService;
    private final SecurityUtils securityUtils;

    public InvitationController(InvitationService invitationService, SecurityUtils securityUtils) {
        this.invitationService = invitationService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<InvitationResponse> create(@CurrentUser UserDetails userDetails,
                                                      @PathVariable Long workspaceId,
                                                      @Valid @RequestBody InvitationRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(invitationService.create(workspaceId, request, userId));
    }

    @GetMapping
    public ResponseEntity<List<InvitationResponse>> list(@CurrentUser UserDetails userDetails,
                                                          @PathVariable Long workspaceId) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(invitationService.list(workspaceId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvitationResponse> getById(@CurrentUser UserDetails userDetails,
                                                       @PathVariable Long workspaceId,
                                                       @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(invitationService.getById(workspaceId, id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvitationResponse> update(@CurrentUser UserDetails userDetails,
                                                      @PathVariable Long workspaceId,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody InvitationRequest request) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(invitationService.update(workspaceId, id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        invitationService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<InvitationResponse> generate(@CurrentUser UserDetails userDetails,
                                                        @PathVariable Long workspaceId,
                                                        @PathVariable Long id,
                                                        @RequestParam(defaultValue = "PDF") ExportFormat format) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(invitationService.generate(workspaceId, id, format, userId));
    }

    @PostMapping("/generate-batch")
    public ResponseEntity<Void> generateBatch(@CurrentUser UserDetails userDetails,
                                               @PathVariable Long workspaceId,
                                               @RequestParam(required = false) String templateId,
                                               @RequestParam(defaultValue = "PDF") ExportFormat format) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        invitationService.generateBatch(workspaceId, templateId, format, userId);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@CurrentUser UserDetails userDetails,
                                            @PathVariable Long workspaceId,
                                            @PathVariable Long id,
                                            @RequestParam(defaultValue = "PDF") ExportFormat format) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        byte[] content = invitationService.download(workspaceId, id, format, userId);

        MediaType mediaType = format == ExportFormat.PDF
                ? MediaType.APPLICATION_PDF
                : MediaType.IMAGE_JPEG;
        String extension = format.name().toLowerCase();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invitation-" + id + "." + extension)
                .body(content);
    }

    @PostMapping("/preview")
    public ResponseEntity<byte[]> preview(@Valid @RequestBody InvitationRequest request,
                                           @RequestParam(defaultValue = "PDF") ExportFormat format) {
        byte[] content = invitationService.preview(request, format);

        MediaType mediaType = format == ExportFormat.PDF
                ? MediaType.APPLICATION_PDF
                : MediaType.IMAGE_JPEG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(content);
    }

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateResponse>> templates() {
        return ResponseEntity.ok(invitationService.listTemplates());
    }
}
