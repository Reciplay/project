package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;

public interface FileMetadataManagementService {
    FileMetadata writeFile(FileMetadata metadata);
    void deleteFile(FileMetadata metadata);
}
