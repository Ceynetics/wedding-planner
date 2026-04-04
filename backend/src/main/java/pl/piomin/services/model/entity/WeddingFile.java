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
import pl.piomin.services.model.enums.FileFolder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = "workspace")
@ToString(exclude = "workspace")
@Entity
@Table(name = "wedding_files")
public class WeddingFile extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 100)
    private String module;

    private Long size;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private FileFolder folder;

    @Column(name = "s3_key", nullable = false, length = 500)
    private String s3Key;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
