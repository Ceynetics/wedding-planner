package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pl.piomin.services.model.entity.Task;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByWorkspaceId(Long workspaceId);

    List<Task> findByWorkspaceIdAndDueDateBetween(Long workspaceId, LocalDate start, LocalDate end);

    long countByWorkspaceIdAndIsCompletedTrue(Long workspaceId);

    long countByWorkspaceIdAndIsCompletedFalse(Long workspaceId);
}
