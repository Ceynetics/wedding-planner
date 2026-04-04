package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.Invitation;

import java.util.List;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findByWorkspaceId(Long workspaceId);

    List<Invitation> findByWorkspaceIdAndHouseholdId(Long workspaceId, Long householdId);
}
