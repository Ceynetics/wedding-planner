package pl.piomin.services.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.piomin.services.model.enums.AddressStyle;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"members", "workspace", "assignedTable"})
@ToString(exclude = {"members", "workspace", "assignedTable"})
@Entity
@Table(name = "households")
public class Household extends BaseEntity {

    @Column(name = "household_name", nullable = false, length = 100)
    private String householdName;

    @Column(name = "formal_address", length = 200)
    private String formalAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "address_style", nullable = false, length = 15)
    private AddressStyle addressStyle;

    @Column(name = "head_guest_id")
    private Long headGuestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_table_id")
    private SeatingTable assignedTable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Builder.Default
    @OneToMany(mappedBy = "household")
    private List<Guest> members = new ArrayList<>();
}
