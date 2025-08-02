package com.e104.reciplay.s3.repository.custom;

import com.e104.reciplay.s3.domain.FileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;

import java.util.Optional;

public interface CustomFileMetadataRepository {
    Optional<FileMetadata> findMetadata(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence);

}
