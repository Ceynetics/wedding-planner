package pl.piomin.services.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.piomin.services.exception.ResourceNotFoundException;
import pl.piomin.services.model.dto.request.HiredVendorRequest;
import pl.piomin.services.model.dto.response.HiredVendorResponse;
import pl.piomin.services.model.entity.HiredVendor;
import pl.piomin.services.model.entity.Vendor;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.repository.HiredVendorRepository;
import pl.piomin.services.repository.VendorRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HiredVendorService {

    private static final Logger log = LoggerFactory.getLogger(HiredVendorService.class);

    private final HiredVendorRepository hiredVendorRepository;
    private final VendorRepository vendorRepository;
    private final WorkspaceAuthorizationService authorizationService;

    public HiredVendorService(HiredVendorRepository hiredVendorRepository,
                              VendorRepository vendorRepository,
                              WorkspaceAuthorizationService authorizationService) {
        this.hiredVendorRepository = hiredVendorRepository;
        this.vendorRepository = vendorRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public HiredVendorResponse create(Long workspaceId, HiredVendorRequest request, Long userId) {
        Workspace workspace = authorizationService.validateMembership(workspaceId, userId);

        Vendor vendor = null;
        if (request.getVendorId() != null) {
            vendor = vendorRepository.findById(request.getVendorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        }

        HiredVendor hiredVendor = HiredVendor.builder()
                .vendorName(request.getVendorName())
                .companyName(request.getCompanyName())
                .category(request.getCategory())
                .address(request.getAddress())
                .email(request.getEmail())
                .phone(request.getPhone())
                .totalAmount(request.getTotalAmount())
                .paidAmount(request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO)
                .notes(request.getNotes())
                .reminderEnabled(request.isReminderEnabled())
                .frequency(request.getFrequency())
                .dueDate(request.getDueDate())
                .vendor(vendor)
                .workspace(workspace)
                .build();

        hiredVendor = hiredVendorRepository.save(hiredVendor);
        log.info("Hired vendor created: id={}, workspaceId={}, vendorName={}", hiredVendor.getId(), workspaceId, hiredVendor.getVendorName());
        return toResponse(hiredVendor);
    }

    public List<HiredVendorResponse> list(Long workspaceId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        log.debug("Listing hired vendors: workspaceId={}", workspaceId);
        return hiredVendorRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public HiredVendorResponse getById(Long workspaceId, Long hiredVendorId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        HiredVendor hv = findInWorkspace(workspaceId, hiredVendorId);
        return toResponse(hv);
    }

    @Transactional
    public HiredVendorResponse update(Long workspaceId, Long hiredVendorId, HiredVendorRequest request, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        HiredVendor hv = findInWorkspace(workspaceId, hiredVendorId);

        hv.setVendorName(request.getVendorName());
        hv.setCompanyName(request.getCompanyName());
        hv.setCategory(request.getCategory());
        hv.setAddress(request.getAddress());
        hv.setEmail(request.getEmail());
        hv.setPhone(request.getPhone());
        hv.setTotalAmount(request.getTotalAmount());
        if (request.getPaidAmount() != null) hv.setPaidAmount(request.getPaidAmount());
        hv.setNotes(request.getNotes());
        hv.setReminderEnabled(request.isReminderEnabled());
        hv.setFrequency(request.getFrequency());
        hv.setDueDate(request.getDueDate());

        hv = hiredVendorRepository.save(hv);
        log.info("Hired vendor updated: id={}, workspaceId={}", hv.getId(), workspaceId);
        return toResponse(hv);
    }

    @Transactional
    public void delete(Long workspaceId, Long hiredVendorId, Long userId) {
        authorizationService.validateMembership(workspaceId, userId);
        HiredVendor hv = findInWorkspace(workspaceId, hiredVendorId);
        hiredVendorRepository.delete(hv);
        log.info("Hired vendor deleted: id={}, workspaceId={}", hiredVendorId, workspaceId);
    }

    private HiredVendor findInWorkspace(Long workspaceId, Long hiredVendorId) {
        HiredVendor hv = hiredVendorRepository.findById(hiredVendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Hired vendor not found"));
        if (!hv.getWorkspace().getId().equals(workspaceId)) {
            throw new ResourceNotFoundException("Hired vendor not found in this workspace");
        }
        return hv;
    }

    private HiredVendorResponse toResponse(HiredVendor hv) {
        return HiredVendorResponse.builder()
                .id(hv.getId())
                .vendorName(hv.getVendorName())
                .companyName(hv.getCompanyName())
                .category(hv.getCategory())
                .address(hv.getAddress())
                .email(hv.getEmail())
                .phone(hv.getPhone())
                .totalAmount(hv.getTotalAmount())
                .paidAmount(hv.getPaidAmount())
                .notes(hv.getNotes())
                .reminderEnabled(hv.isReminderEnabled())
                .frequency(hv.getFrequency())
                .dueDate(hv.getDueDate())
                .vendorId(hv.getVendor() != null ? hv.getVendor().getId() : null)
                .build();
    }
}
