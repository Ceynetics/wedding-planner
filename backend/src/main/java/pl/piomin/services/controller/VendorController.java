package pl.piomin.services.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.piomin.services.model.dto.response.VendorResponse;
import pl.piomin.services.model.enums.VendorCategory;
import pl.piomin.services.service.VendorService;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<Page<VendorResponse>> list(
            @RequestParam(required = false) VendorCategory category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "rating", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(vendorService.list(category, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }
}
