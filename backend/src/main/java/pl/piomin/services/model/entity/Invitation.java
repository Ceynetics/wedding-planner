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
import pl.piomin.services.model.enums.InvitationStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"household", "workspace"})
@ToString(exclude = {"household", "workspace"})
@Entity
@Table(name = "invitations")
public class Invitation extends BaseEntity {

    @Column(name = "template_id", length = 20)
    private String templateId;

    @Column(length = 100)
    private String name1;

    @Column(length = 100)
    private String name2;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time")
    private LocalTime eventTime;

    @Column(length = 255)
    private String venue;

    @Column(name = "selected_color", length = 10)
    private String selectedColor;

    @Column(length = 200)
    private String greeting;

    @Column(name = "address_line", length = 200)
    private String addressLine;

    @Column(name = "is_vip_guest")
    private boolean isVipGuest;

    @Column(name = "pdf_s3_key", length = 500)
    private String pdfS3Key;

    @Column(name = "jpeg_s3_key", length = 500)
    private String jpegS3Key;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    @Builder.Default
    private InvitationStatus status = InvitationStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
