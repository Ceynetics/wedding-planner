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
import pl.piomin.services.model.enums.ExpenseCategory;
import pl.piomin.services.model.enums.Payer;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = "workspace")
@ToString(exclude = "workspace")
@Entity
@Table(name = "expenses")
public class Expense extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private ExpenseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "paid_by", length = 10)
    private Payer paidBy;

    @Column(name = "is_paid")
    private boolean isPaid;

    @Column(name = "split_enabled")
    private boolean splitEnabled;

    @Column(length = 500)
    private String notes;

    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
