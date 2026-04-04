package pl.piomin.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.HiredVendor;

import java.time.LocalDate;
import java.util.List;

public interface HiredVendorRepository extends JpaRepository<HiredVendor, Long> {

    List<HiredVendor> findByWorkspaceId(Long workspaceId);

    List<HiredVendor> findByWorkspaceIdAndDueDateBetween(Long workspaceId, LocalDate start, LocalDate end);
}
