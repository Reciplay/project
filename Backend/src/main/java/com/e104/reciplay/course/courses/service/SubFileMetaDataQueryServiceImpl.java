package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubFileMetaDataQueryServiceImpl implements SubFileMetadataQueryService{

    private final FileMetadataRepository fileMetadataRepository;


    @Override
    public List<FileMetadata> queryMetadataListByCondition(Long relatedId, String relatedType) {
        RelatedType related = RelatedType.valueOf(relatedType);
        return fileMetadataRepository.findListByRelatedIdAndRelatedType(relatedId, related);
    }

    @Override
    public FileMetadata queryMetadataByCondition(Long relatedId, String relatedType) {
        RelatedType related = RelatedType.valueOf(relatedType);
        return fileMetadataRepository.findByRelatedIdAndRelatedType(relatedId, related);
    }

}
