package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;

public interface FileMetadataQueryService {
    FileMetadata queryUserProfilePhoto(Long userId);
    FileMetadata queryByMetadata(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence);
}
