package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class S3ServiceImplTest {

    @InjectMocks
    private S3ServiceImpl s3Service;

    @Mock
    private S3Client s3Client;

    @Mock
    private FileMetadataRepository repository;

    @BeforeEach
    void setUp() throws Exception {
        s3Service = new S3ServiceImpl(s3Client, repository);
        // 수동 설정이므로 @Value 대체
        setPrivateField(s3Service, "bucket", "test-bucket");
        setPrivateField(s3Service, "accessKey", "test-access-key");
        setPrivateField(s3Service, "secretKey", "test-secret-key");
        setPrivateField(s3Service, "region", "ap-northeast-2");
    }

    @Test
    void testUploadFile_success() throws IOException {
        // given
        byte[] fileContent = "test file".getBytes();
        MockMultipartFile multipartFile = new MockMultipartFile(
                "lecture/1", "test.pdf", "material/pdf", fileContent);

        FileMetadata mockSavedMetadata = FileMetadata.builder()
                .id(123L)
                .name("test.mp4")
                .category(FileCategory.VIDEOS)
                .relatedType(RelatedType.REPLAY)
                .relatedId(1L)
                .resourceType("mp4")
                .uploadedAt(LocalDateTime.now())
                .sequence(1)
                .build();

        when(repository.save(any())).thenReturn(mockSavedMetadata);

        // when
        s3Service.uploadFile(multipartFile, 1L);

        // then
        verify(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));
        verify(repository).save(any(FileMetadata.class));
    }

    @Test
    void testGetResponseFileInfo_success() {
        // given
        FileMetadata metadata = FileMetadata.builder()
                .id(1L)
                .name("sample.jpg")
                .category(FileCategory.IMAGES)
                .relatedType(RelatedType.USER_PROFILE)
                .relatedId(100L)
                .resourceType("jpg")
                .sequence(1)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(repository.findMetadata(FileCategory.IMAGES, RelatedType.USER_PROFILE, 100L, 1))
                .thenReturn(Optional.of(metadata));

        // when
        ResponseFileInfo result = s3Service.getResponseFileInfo(
                FileCategory.IMAGES, RelatedType.USER_PROFILE, 100L, 1
        );

        // then
        assertEquals("sample.jpg", result.getName());
        assertTrue(result.getPresigedUrl().contains("http")); // Presigned URL 형식만 체크
    }

    @Test
    void testDeleteFile_success() {
        // given
        FileMetadata metadata = FileMetadata.builder()
                .id(1L)
                .name("replay.mp4")
                .category(FileCategory.VIDEOS)
                .relatedType(RelatedType.REPLAY)
                .relatedId(100L)
                .resourceType("mp4")
                .sequence(1)
                .build();

        when(repository.findMetadata(FileCategory.VIDEOS, RelatedType.REPLAY, 100L, 1))
                .thenReturn(Optional.of(metadata));

        // when
        s3Service.deleteFile(FileCategory.VIDEOS, RelatedType.REPLAY, 100L, 1);

        // then
        verify(s3Client).deleteObject(any(DeleteObjectRequest.class));
        verify(repository).deleteById(1L);
    }
    private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
