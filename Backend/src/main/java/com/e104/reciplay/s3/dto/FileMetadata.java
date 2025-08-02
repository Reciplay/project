package com.e104.reciplay.s3.dto;

import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private FileCategory category;

    private String resourceType;

    @Enumerated(EnumType.STRING)
    private RelatedType relatedType;

    private Long relatedId;

    private Integer sequence;

    private LocalDateTime uploadedAt;
}

