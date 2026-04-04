package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.SeatingTable;

import java.util.List;

public interface SeatingTableRepository extends JpaRepository<SeatingTable, Long> {

    List<SeatingTable> findByWorkspaceId(Long workspaceId);
}
