package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.exception.FileMetadataNotFoundException;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FileMetadataQueryServiceImpl implements FileMetadataQueryService{
    private final FileMetadataRepository fileMetadataRepository;

    @Override
    public FileMetadata queryUserProfilePhoto(Long userId) {
        return fileMetadataRepository.findMetadata(FileCategory.IMAGES, RelatedType.USER_PROFILE, userId, 0)
                .orElseThrow(()-> new FileMetadataNotFoundException("프로필 이미지가 존재하지 않습니다."));
    }

    @Override
    public FileMetadata queryByMetadata(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) {
        return fileMetadataRepository.findMetadata(category, relatedType, relatedId, sequence)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 파일이 존재하지 않습니다."));
    }
}
