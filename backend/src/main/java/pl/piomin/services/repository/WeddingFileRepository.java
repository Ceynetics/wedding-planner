package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.WeddingFile;
import pl.piomin.services.model.enums.FileFolder;

import java.util.List;

public interface WeddingFileRepository extends JpaRepository<WeddingFile, Long> {

    List<WeddingFile> findByWorkspaceId(Long workspaceId);

    List<WeddingFile> findByWorkspaceIdAndFolder(Long workspaceId, FileFolder folder);
}
