package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.WorkspaceMember;

import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {

    List<WorkspaceMember> findByUserId(Long userId);

    Optional<WorkspaceMember> findByUserIdAndWorkspaceId(Long userId, Long workspaceId);

    List<WorkspaceMember> findByWorkspaceId(Long workspaceId);

    boolean existsByUserIdAndWorkspaceId(Long userId, Long workspaceId);
}
