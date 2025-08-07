package com.e104.reciplay.s3.repository;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.repository.custom.CustomFileMetadataRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long>, CustomFileMetadataRepository {
    List<FileMetadata> findListByRelatedIdAndRelatedType(Long relatedId, String relatedType);

    FileMetadata findByRelatedIdAndRelatedType(Long relatedId, String relatedType);
}
