package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.entity.FileMetadata;

import java.util.List;

public interface SubFileMetadataQueryService {
    List<FileMetadata> queryMetadataListByCondition(Long relatedId, String relatedType);

    FileMetadata queryMetadataByCondition(Long relatedId, String relatedType);
}
