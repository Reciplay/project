package com.e104.reciplay.s3.service;


import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
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
    private final FileMetadataRepository repository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.s3.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.s3.region.static}")
    private String region;

    @Override
    // 해당 파일 s3에 업로드 및 메타 데이터 db에 저장
    public void uploadFile(MultipartFile file, Long relatedId) throws IOException {
        String resourceType = FilenameUtils.getExtension(file.getOriginalFilename()); // resourceType
        RelatedType relatedType = null;
        Integer sequence = 0;
        String parts[] = null;
        String fileName = file.getOriginalFilename();

        String name = file.getContentType().split("/")[0].toUpperCase() + "S";
        FileCategory category = FileCategory.valueOf(name);

        if (file.getName().startsWith("thumbnail/") || file.getName().startsWith("lecture/")){
            parts = file.getName().split("/");
            relatedType = RelatedType.valueOf(parts[0].toUpperCase());
            sequence = Integer.parseInt(parts[1]);
        }else{
            relatedType = RelatedType.valueOf(file.getName().toUpperCase());
            sequence = 0;
        }

        switch(category.name()){
            case "MATERIALS" -> {
                if (!List.of("pdf", "doc", "docx", "ppt", "pptx", "txt").contains(resourceType)) {
                    throw new IllegalArgumentException("MATERIAL에는 pdf, doc, docx, ppt, pptx, txt만 허용됩니다.");
                }
            }
            case "IMAGES" -> {
                if (!List.of("jpg", "jpeg").contains(resourceType)) {
                    throw new IllegalArgumentException("IMAGES에는 jpg, jpeg만 허용됩니다.");
                }
            }
            case "VIDEOS" -> {
                if (!List.of("mp4", "avi").contains(resourceType)) {
                    throw new IllegalArgumentException("VIDEOS에는 mp4, avi만 허용됩니다.");
                }
            }
            default -> {
                throw new IllegalArgumentException("지원하지 않는 파일 타입입니다: " + relatedType);
            }
        }

        // 1. DB에 메타데이터 저장
        FileMetadata metadata = repository.save(
                FileMetadata.builder()
                        .category(category)
                        .resourceType(resourceType)
                        .relatedType(relatedType)
                        .relatedId(relatedId)
                        .uploadedAt(LocalDateTime.now())
                        .sequence(sequence)
                        .name(fileName)
                        .build()
        );


        // 2. S3 경로 구성
        String path = String.format("%s/%s/%d.%s",
                category.name().toLowerCase(),
                relatedType.name().toLowerCase(),
                metadata.getId(),
                resourceType);
//

        // 3. S3에 직접 업로드
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

    }

    @Override
    public ResponseFileInfo getResponseFileInfo(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence){

        ResponseFileInfo responseFileInfo = new ResponseFileInfo();

        // 1. DB에서 해당 파일 메타데이터 찾기
        FileMetadata metadata = repository.findMetadata(
                category, relatedType, relatedId, sequence
        ).orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // 2. Presigner 생성
        S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        )
                ).build();

        // 3. Presigned URL 생성
        String path = String.format("%s/%s/%d.%s",
                metadata.getCategory().name().toLowerCase(),
                metadata.getRelatedType().name().toLowerCase(),
                metadata.getId(),
                metadata.getResourceType());

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(path).build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(getObjectRequest)
                .build();

        responseFileInfo.setName(metadata.getName());
        responseFileInfo.setPresigedUrl(presigner.presignGetObject(presignRequest).url().toString());
        return responseFileInfo;

    }


    @Override
    // 해당 파일 PresigedUrl 생성 후 반환
    public ResponseFileInfo getResponseFileInfo(FileMetadata condition) {
        FileCategory category = condition.getCategory();
        RelatedType relatedType = condition.getRelatedType();
        Long relatedId = condition.getRelatedId();
        Integer sequence = condition.getSequence();

        ResponseFileInfo responseFileInfo = new ResponseFileInfo();

        // 1. DB에서 해당 파일 메타데이터 찾기
        FileMetadata metadata = repository.findMetadata(
                category, relatedType, relatedId, sequence
        ).orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

        // 2. Presigner 생성
        S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        )
                ).build();

        // 3. Presigned URL 생성
        String path = String.format("%s/%s/%d.%s",
                metadata.getCategory().name().toLowerCase(),
                metadata.getRelatedType().name().toLowerCase(),
                metadata.getId(),
                metadata.getResourceType());

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(path).build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(getObjectRequest)
                .build();

        responseFileInfo.setName(metadata.getName());
        responseFileInfo.setPresigedUrl(presigner.presignGetObject(presignRequest).url().toString());
        return responseFileInfo;
    }


    @Override
    public void deleteFile(FileCategory category, RelatedType relatedType, Long relatedId, Integer sequence) {
        // 1. 메타데이터 조회
        FileMetadata metadata = repository.findMetadata(
                category, relatedType, relatedId, sequence
        ).orElseThrow(() -> new RuntimeException("삭제할 파일을 찾을 수 없습니다."));

        // 2. S3 Key 구성
        String path = String.format("%s/%s/%d.%s",
                metadata.getCategory().name().toLowerCase(),
                metadata.getRelatedType().name().toLowerCase(),
                metadata.getId(),
                metadata.getResourceType()
        );

        // 3. S3에서 삭제
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .build();

        s3Client.deleteObject(deleteRequest);

        // 4. DB에서 메타데이터 삭제
        repository.deleteById(metadata.getId());
    }

    @Override
    public void deleteFile(FileMetadata condition) {
        FileCategory category = condition.getCategory();
        RelatedType relatedType = condition.getRelatedType();
        Long relatedId = condition.getRelatedId();
        Integer sequence = condition.getSequence();
        // 1. 메타데이터 조회
        FileMetadata metadata = repository.findMetadata(
                category, relatedType, relatedId, sequence
        ).orElseThrow(() -> new RuntimeException("삭제할 파일을 찾을 수 없습니다."));

        // 2. S3 Key 구성
        String path = String.format("%s/%s/%d.%s",
                metadata.getCategory().name().toLowerCase(),
                metadata.getRelatedType().name().toLowerCase(),
                metadata.getId(),
                metadata.getResourceType()
        );

        // 3. S3에서 삭제
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .build();

        s3Client.deleteObject(deleteRequest);

        // 4. DB에서 메타데이터 삭제
        repository.deleteById(metadata.getId());
    }

}
