package pl.piomin.services.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = "members")
@ToString(exclude = "members")
@Entity
@Table(name = "workspaces")
public class Workspace extends BaseEntity {

    @Column(name = "event_name", nullable = false, length = 100)
    private String eventName;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(length = 255)
    private String venue;

    @Column(precision = 12, scale = 2)
    private BigDecimal budget;

    @Column(name = "pairing_code", unique = true, length = 8)
    private String pairingCode;

    @Builder.Default
    @OneToMany(mappedBy = "workspace")
    private List<WorkspaceMember> members = new ArrayList<>();
}
