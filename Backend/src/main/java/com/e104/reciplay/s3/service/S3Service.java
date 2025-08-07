package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface S3Service {

    /**
     * 파일을 업로드하고 S3 경로를 반환한다.
     */
    void uploadFile(MultipartFile file, FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) throws IOException;

    String generatePresignedUrl(String path);
    /**
     * Presigned URL을 반환한다.
     */
    ResponseFileInfo getResponseFileInfo(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence);

    ResponseFileInfo getResponseFileInfo(FileMetadata condition);

    /**
     * S3와 DB에서 파일을 삭제한다.
     */
    void deleteFile(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence);

    void deleteFile(FileMetadata condition);
}
