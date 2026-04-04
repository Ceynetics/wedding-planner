package pl.piomin.services.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HiredVendorResponse {

    private Long id;
    private String vendorName;
    private String companyName;
    private VendorCategory category;
    private String address;
    private String email;
    private String phone;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private String notes;
    private boolean reminderEnabled;
    private PaymentFrequency frequency;
    private LocalDate dueDate;
    private Long vendorId;
}
