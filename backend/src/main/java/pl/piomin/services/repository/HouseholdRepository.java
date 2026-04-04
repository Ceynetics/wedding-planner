package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.Household;

import java.util.List;

public interface HouseholdRepository extends JpaRepository<Household, Long> {

    List<Household> findByWorkspaceId(Long workspaceId);

    List<Household> findByWorkspaceIdAndAssignedTableIsNull(Long workspaceId);
}
