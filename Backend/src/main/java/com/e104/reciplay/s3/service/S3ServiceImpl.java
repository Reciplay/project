package com.e104.reciplay.s3.service;


import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import com.e104.reciplay.s3.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;
    private final FileMetadataManagementService fileMetadataManagementService;
    private final FileMetadataQueryService fileMetadataQueryService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.s3.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.s3.region.static}")
    private String region;

    @Value("${application.presigned-ttl}")
    private Long ttl;

    ///////////// ✅
    @Override
    public void uploadFile(MultipartFile file, FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) throws IOException {
        CustomFileUtil.validateFile(file, category, relatedType); // 파일 유효성 검사.
        FileMetadata fileMetadata = new FileMetadata(file, category, relatedType, relatedId, sequence); // 파일 개체 생성
        fileMetadataManagementService.writeFile(fileMetadata);
        String path = formPath(fileMetadata);
        writeObjectOnStorage(path, file);
    }


    @Override
    public ResponseFileInfo getResponseFileInfo(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence){
        // 1. DB에서 해당 파일 메타데이터 찾기
        FileMetadata metadata = fileMetadataQueryService.queryByMetadata(category, relatedType, relatedId, sequence);
        String path = formPath(metadata);
        String presignedUrl = generatePresignedUrl(path);
        return new ResponseFileInfo(presignedUrl, metadata.getName(), metadata.getSequence());
    }


    @Override
    // 해당 파일 PresigedUrl 생성 후 반환
    public ResponseFileInfo getResponseFileInfo(FileMetadata metadata) {
        String path = formPath(metadata);
        String presignedUrl = generatePresignedUrl(path);
        return new ResponseFileInfo(presignedUrl, metadata.getName(), metadata.getSequence());
    }


    @Override
    public void deleteFile(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) {
        // 1. 메타데이터 조회
        FileMetadata metadata = fileMetadataQueryService.queryByMetadata(category, relatedType, relatedId, sequence);
        // 2. S3 Key 구성
        String path = formPath(metadata);
        // 3. S3에서 삭제
        deleteFromStorage(path);
        // 4. DB에서 메타데이터 삭제
        fileMetadataManagementService.deleteFile(metadata);
    }

    @Override
    public void deleteFile(FileMetadata metadata) {
        String path = formPath(metadata);
        // 3. S3에서 삭제
        deleteFromStorage(path);
        // 4. DB에서 메타데이터 삭제
        fileMetadataManagementService.deleteFile(metadata);
    }

    // Presigned URL 생성
    @Override
    public String generatePresignedUrl(String path) {
        S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))
                ).build();

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(path).build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(ttl))
                .getObjectRequest(getObjectRequest)
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }

    // S3 경로 구성
    private String formPath(FileMetadata metadata) {
        return String.format("%s/%s/%d.%s",
                metadata.getCategory().name().toLowerCase(),
                metadata.getRelatedType().name().toLowerCase(),
                metadata.getId(),
                metadata.getResourceType()
        );
    }

    // S3에 파일을 쓰는 작업.
    private void writeObjectOnStorage(String path, MultipartFile file) throws IOException {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
    }

    private void deleteFromStorage(String path) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .build();

        s3Client.deleteObject(deleteRequest);
    }

}
