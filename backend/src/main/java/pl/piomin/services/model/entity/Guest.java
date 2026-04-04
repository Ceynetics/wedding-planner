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
import pl.piomin.services.model.enums.GuestCategory;
import pl.piomin.services.model.enums.GuestSide;
import pl.piomin.services.model.enums.GuestStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"household", "workspace"})
@ToString(exclude = {"household", "workspace"})
@Entity
@Table(name = "guests")
public class Guest extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 10)
    private String title;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private GuestSide side;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private GuestStatus status;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private GuestCategory category;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Builder.Default
    private Integer adults = 1;

    @Builder.Default
    private Integer children = 0;

    @Column(length = 50)
    private String dietary;

    @Column(name = "is_vip")
    private boolean isVip;

    @Column(name = "is_head_of_household")
    private boolean isHeadOfHousehold;

    @Column(length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
