package pl.piomin.services.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.piomin.services.model.entity.Vendor;
import pl.piomin.services.model.enums.VendorCategory;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Page<Vendor> findByCategory(VendorCategory category, Pageable pageable);

    Page<Vendor> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Vendor> findByCategoryAndNameContainingIgnoreCase(VendorCategory category, String name, Pageable pageable);
}
