package com.e104.reciplay.s3.repository;

import com.e104.reciplay.s3.dto.FileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    Optional<FileMetadata> findFirstByCategoryAndRelatedTypeAndRelatedIdAndSequenceOrderByUploadedAtDesc(
            FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence
    );
}
