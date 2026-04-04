package pl.piomin.services.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.piomin.services.model.enums.PaymentFrequency;
import pl.piomin.services.model.enums.VendorCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"vendor", "workspace"})
@ToString(exclude = {"vendor", "workspace"})
@Entity
@Table(name = "hired_vendors")
public class HiredVendor extends BaseEntity {

    @Column(name = "vendor_name", nullable = false, length = 100)
    private String vendorName;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private VendorCategory category;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(length = 500)
    private String notes;

    @Column(name = "reminder_enabled")
    private boolean reminderEnabled;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private PaymentFrequency frequency;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
