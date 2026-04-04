package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pl.piomin.services.model.entity.Guest;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long>, JpaSpecificationExecutor<Guest> {

    List<Guest> findByWorkspaceId(Long workspaceId);

    List<Guest> findByHouseholdId(Long householdId);

    long countByWorkspaceId(Long workspaceId);

    long countByWorkspaceIdAndStatus(Long workspaceId, pl.piomin.services.model.enums.GuestStatus status);

    long countByWorkspaceIdAndIsVipTrue(Long workspaceId);
}
