package pl.piomin.services.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.piomin.services.model.dto.request.HiredVendorRequest;
import pl.piomin.services.model.dto.response.HiredVendorResponse;
import pl.piomin.services.model.entity.HiredVendor;
import pl.piomin.services.model.entity.Workspace;
import pl.piomin.services.model.enums.PaymentFrequency;
import pl.piomin.services.model.enums.VendorCategory;
import pl.piomin.services.repository.HiredVendorRepository;
import pl.piomin.services.repository.VendorRepository;
import pl.piomin.services.security.WorkspaceAuthorizationService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HiredVendorServiceTest {

    @Mock private HiredVendorRepository hiredVendorRepository;
    @Mock private VendorRepository vendorRepository;
    @Mock private WorkspaceAuthorizationService authorizationService;

    @InjectMocks
    private HiredVendorService hiredVendorService;

    private Workspace testWorkspace;

    @BeforeEach
    void setUp() {
        testWorkspace = Workspace.builder().eventName("Wedding").build();
        testWorkspace.setId(1L);
    }

    @Test
    void create_shouldCreateHiredVendor() {
        HiredVendorRequest request = HiredVendorRequest.builder()
                .vendorName("Lumina Studios")
                .category(VendorCategory.PHOTOGRAPHY)
                .totalAmount(BigDecimal.valueOf(3500))
                .frequency(PaymentFrequency.ONE_TIME)
                .dueDate(LocalDate.of(2026, 5, 1))
                .build();

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);

        HiredVendor saved = HiredVendor.builder()
                .vendorName("Lumina Studios").category(VendorCategory.PHOTOGRAPHY)
                .totalAmount(BigDecimal.valueOf(3500)).paidAmount(BigDecimal.ZERO)
                .frequency(PaymentFrequency.ONE_TIME).dueDate(LocalDate.of(2026, 5, 1))
                .workspace(testWorkspace).build();
        saved.setId(1L);

        when(hiredVendorRepository.save(any(HiredVendor.class))).thenReturn(saved);

        HiredVendorResponse response = hiredVendorService.create(1L, request, 1L);

        assertNotNull(response);
        assertEquals("Lumina Studios", response.getVendorName());
        assertEquals(BigDecimal.valueOf(3500), response.getTotalAmount());
        assertEquals(BigDecimal.ZERO, response.getPaidAmount());
    }

    @Test
    void list_shouldReturnHiredVendors() {
        HiredVendor hv = HiredVendor.builder()
                .vendorName("Test Vendor").category(VendorCategory.VENUE)
                .totalAmount(BigDecimal.valueOf(10000)).paidAmount(BigDecimal.valueOf(5000))
                .workspace(testWorkspace).build();
        hv.setId(1L);

        when(authorizationService.validateMembership(1L, 1L)).thenReturn(testWorkspace);
        when(hiredVendorRepository.findByWorkspaceId(1L)).thenReturn(List.of(hv));

        List<HiredVendorResponse> result = hiredVendorService.list(1L, 1L);

        assertEquals(1, result.size());
        assertEquals("Test Vendor", result.get(0).getVendorName());
    }
}
