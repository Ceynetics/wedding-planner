package pl.piomin.services.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import pl.piomin.services.model.dto.response.FileResponse;
import pl.piomin.services.model.enums.FileFolder;
import pl.piomin.services.security.CurrentUser;
import pl.piomin.services.security.SecurityUtils;
import pl.piomin.services.service.FileStorageService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/files")
public class FileController {

    private final FileStorageService fileStorageService;
    private final SecurityUtils securityUtils;

    public FileController(FileStorageService fileStorageService, SecurityUtils securityUtils) {
        this.fileStorageService = fileStorageService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<FileResponse> upload(@CurrentUser UserDetails userDetails,
                                                @PathVariable Long workspaceId,
                                                @RequestParam MultipartFile file,
                                                @RequestParam FileFolder folder,
                                                @RequestParam(required = false) String module) throws IOException {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fileStorageService.upload(workspaceId, file, folder, module, userId));
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> list(@CurrentUser UserDetails userDetails,
                                                    @PathVariable Long workspaceId,
                                                    @RequestParam(required = false) FileFolder folder) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        return ResponseEntity.ok(fileStorageService.list(workspaceId, folder, userId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@CurrentUser UserDetails userDetails,
                                            @PathVariable Long workspaceId,
                                            @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        byte[] content = fileStorageService.download(workspaceId, id, userId);
        String contentType = fileStorageService.getContentType(workspaceId, id, userId);
        String fileName = fileStorageService.getFileName(workspaceId, id, userId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(content);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser UserDetails userDetails,
                                        @PathVariable Long workspaceId,
                                        @PathVariable Long id) {
        Long userId = securityUtils.getUserFromDetails(userDetails).getId();
        fileStorageService.delete(workspaceId, id, userId);
        return ResponseEntity.noContent().build();
    }
}
