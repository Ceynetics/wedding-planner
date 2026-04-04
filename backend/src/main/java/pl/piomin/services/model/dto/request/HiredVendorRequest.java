package pl.piomin.services.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.piomin.services.model.enums.PaymentFrequency;
import pl.piomin.services.model.enums.VendorCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiredVendorRequest {

    @NotBlank(message = "Vendor name is required")
    @Size(max = 100)
    private String vendorName;

    @Size(max = 100)
    private String companyName;

    private VendorCategory category;

    @Size(max = 255)
    private String address;

    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phone;

    private BigDecimal totalAmount;
    private BigDecimal paidAmount;

    @Size(max = 500)
    private String notes;

    private boolean reminderEnabled;
    private PaymentFrequency frequency;
    private LocalDate dueDate;
    private Long vendorId;
}
