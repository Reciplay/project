package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileMetadataManagementServiceImpl implements FileMetadataManagementService{
    private final FileMetadataRepository fileMetadataRepository;

    @Override
    public FileMetadata writeFile(FileMetadata metadata) {
        return fileMetadataRepository.save(metadata);
    }

    @Override
    public void deleteFile(FileMetadata metadata) {
        fileMetadataRepository.deleteById(metadata.getId());
    }
}
