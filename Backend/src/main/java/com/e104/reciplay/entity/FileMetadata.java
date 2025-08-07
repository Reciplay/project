package com.e104.reciplay.entity;

import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Entity(name = "file_metadata")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private FileCategory category;

    @Column(name = "resource_type")
    private String resourceType;

    @Column(name = "related_type")
    @Enumerated(EnumType.STRING)
    private RelatedType relatedType;

    @Column(name = "related_id")
    private Long relatedId;

    private Integer sequence;

    @CreatedDate
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    private String name;

    public FileMetadata(MultipartFile file, FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) {
        this.name = file.getOriginalFilename();
        this.category = category;
        this.relatedType = relatedType;
        this.relatedId = relatedId;
        this.sequence = sequence;
        this.resourceType = FilenameUtils.getExtension(file.getOriginalFilename());
    }

}

