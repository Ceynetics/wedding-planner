package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.response.FileResponse;
import pl.piomin.services.model.entity.WeddingFile;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.FileFolder;
import pl.piomin.services.repository.WeddingFileRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final S3Client s3Client;
    private final WeddingFileRepository fileRepository;
    private final WorkspaceAuthorizationService authorizationService;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public FileStorageService(S3Client s3Client, WeddingFileRepository fileRepository,
                              WorkspaceAuthorizationService authorizationService) {
        this.s3Client = s3Client;
        this.fileRepository = fileRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public FileResponse upload(Long workspaceId, MultipartFile file, FileFolder folder,
                                String module, Long userId) throws IOException {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String s3Key = "workspaces/" + workspaceId + "/" + folder.name().toLowerCase()
                + "/" + UUID.randomUUID() + "-" + originalFilename;

        // Upload to S3
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(s3Key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Save metadata to DB
        WeddingFile weddingFile = WeddingFile.builder()
                .name(originalFilename)
                .module(module)
                .size(file.getSize())
                .folder(folder)
                .s3Key(s3Key)
                .contentType(file.getContentType())
                .workspace(workspace)
                .build();

        weddingFile = fileRepository.save(weddingFile);
        log.info("File uploaded: id={}, workspaceId={}, name={}, size={}", weddingFile.getId(), workspaceId, originalFilename, file.getSize());
        return toResponse(weddingFile);
    }

    public List<FileResponse> list(Long workspaceId, FileFolder folder, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);

        log.debug("Listing files: workspaceId={}, folder={}", workspaceId, folder);
        List<WeddingFile> files;
        if (folder != null) {
            files = fileRepository.findByWorkspaceIdAndFolder(workspaceId, folder);
        } else {
            files = fileRepository.findByWorkspaceId(workspaceId);
        }

        return files.stream().map(this::toResponse).toList();
    }

    public byte[] download(Long workspaceId, Long fileId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Downloading file: workspaceId={}, fileId={}", workspaceId, fileId);
        WeddingFile weddingFile = findFileInWorkspace(workspaceId, fileId);

        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(weddingFile.getS3Key())
                .build();

        try {
            return s3Client.getObject(getRequest).readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage(), e);
        }
    }

    public String getContentType(Long workspaceId, Long fileId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        WeddingFile weddingFile = findFileInWorkspace(workspaceId, fileId);
        return weddingFile.getContentType();
    }

    public String getFileName(Long workspaceId, Long fileId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        WeddingFile weddingFile = findFileInWorkspace(workspaceId, fileId);
        return weddingFile.getName();
    }

    @Transactional
    public void delete(Long workspaceId, Long fileId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        WeddingFile weddingFile = findFileInWorkspace(workspaceId, fileId);

        // Delete from S3
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(weddingFile.getS3Key())
                .build();

        try {
            s3Client.deleteObject(deleteRequest);
        } catch (Exception e) {
            log.warn("Failed to delete file from S3: {}", e.getMessage());
        }

        fileRepository.delete(weddingFile);
        log.info("File deleted: id={}, workspaceId={}, s3Key={}", fileId, workspaceId, weddingFile.getS3Key());
    }

    private WeddingFile findFileInWorkspace(Long workspaceId, Long fileId) {
        WeddingFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        if (!file.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("File not found in this workspace");
        }
        return file;
    }

    private FileResponse toResponse(WeddingFile file) {
        return FileResponse.builder()
                .id(file.getId())
                .name(file.getName())
                .module(file.getModule())
                .size(file.getSize())
                .folder(file.getFolder())
                .contentType(file.getContentType())
                .createdAt(file.getCreatedAt())
                .build();
    }
}
