package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.response.VendorResponse;
import pl.piomin.services.model.entity.Vendor;
import pl.piomin.services.model.enums.VendorCategory;
import pl.piomin.services.repository.VendorRepository;

@Service
public class VendorService {

    private static final Logger log = LoggerFactory.getLogger(VendorService.class);

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public Page<VendorResponse> list(VendorCategory category, String search, Pageable pageable) {
        log.debug("Listing vendors: category={}, search={}, page={}", category, search, pageable.getPageNumber());
        Page<Vendor> vendors;

        if (category != null && search != null && !search.isBlank()) {
            vendors = vendorRepository.findByCategoryAndNameContainingIgnoreCase(category, search, pageable);
        } else if (category != null) {
            vendors = vendorRepository.findByCategory(category, pageable);
        } else if (search != null && !search.isBlank()) {
            vendors = vendorRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            vendors = vendorRepository.findAll(pageable);
        }

        return vendors.map(this::toResponse);
    }

    public VendorResponse getById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        return toResponse(vendor);
    }

    private VendorResponse toResponse(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .category(vendor.getCategory())
                .rating(vendor.getRating())
                .reviewCount(vendor.getReviewCount())
                .imageUrl(vendor.getImageUrl())
                .price(vendor.getPrice())
                .description(vendor.getDescription())
                .address(vendor.getAddress())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .services(vendor.getServices())
                .build();
    }
}
