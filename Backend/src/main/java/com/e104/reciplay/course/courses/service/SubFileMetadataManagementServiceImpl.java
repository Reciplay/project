package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubFileMetadataManagementServiceImpl implements SubFileMetadataManagementService{
    private final FileMetadataRepository fileMetadataRepository;
    @Override
    public void deleteMetadataByEntitiy(FileMetadata fileMetadata) {
        fileMetadataRepository.delete(fileMetadata);
    }
}
