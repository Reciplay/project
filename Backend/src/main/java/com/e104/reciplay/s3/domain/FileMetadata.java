package com.e104.reciplay.s3.domain;

import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
}

