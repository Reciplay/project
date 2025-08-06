package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;

public interface FileMetadataQueryService {
    FileMetadata queryUserProfilePhoto(Long userId);
}
