package com.e104.reciplay.s3.service;

import com.e104.reciplay.s3.dto.FileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class S3ServiceImplTest {

    @InjectMocks
    private S3ServiceImpl s3Service;

    @Mock
    private FileMetadataRepository repository;

    @Mock
    private S3Client s3Client;

    @Captor
    ArgumentCaptor<PutObjectRequest> putRequestCaptor;

    @BeforeEach
    void setUp() throws Exception{
        MockitoAnnotations.openMocks(this);

        setPrivateField(s3Service, "bucket", "test-bucket");
        setPrivateField(s3Service, "accessKey", "dummy-access");
        setPrivateField(s3Service, "secretKey", "dummy-secret");
        setPrivateField(s3Service, "region", "ap-northeast-2");
    }

    private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    @DisplayName("✅ 파일 업로드 성공")
    void testUploadFile() throws IOException {
        // Given
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", "image-bytes".getBytes());
        FileMetadata savedMetadata = FileMetadata.builder()
                .id(1L)
                .category(FileCategory.IMAGES)
                .relatedType(RelatedType.USER_PROFILE)
                .resourceType("png")
                .relatedId(1L)
                .sequence(0)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(repository.save(any())).thenReturn(savedMetadata);

        // When
        String resultPath = s3Service.uploadFile(file, FileCategory.IMAGES, RelatedType.USER_PROFILE, 1L, 0);

        // Then
        verify(s3Client).putObject(putRequestCaptor.capture(), any(RequestBody.class));
        assertThat(resultPath).isEqualTo("images/user_profile/1.png");
        assertThat(putRequestCaptor.getValue().bucket()).isEqualTo("test-bucket");
        assertThat(putRequestCaptor.getValue().key()).isEqualTo("images/user_profile/1.png");
    }

    @Test
    @DisplayName("✅ Presigned URL 생성 성공")
    void testGetPresignedUrl() {
        // Given
        FileMetadata metadata = FileMetadata.builder()
                .id(1L)
                .category(FileCategory.IMAGES)
                .relatedType(RelatedType.USER_PROFILE)
                .resourceType("png")
                .relatedId(1L)
                .sequence(0)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(repository.findFirstByCategoryAndRelatedTypeAndRelatedIdAndSequenceOrderByUploadedAtDesc(
                FileCategory.IMAGES, RelatedType.USER_PROFILE, 1L, 0))
                .thenReturn(Optional.of(metadata));

        // When
        String url = s3Service.getPresignedUrl(FileCategory.IMAGES, RelatedType.USER_PROFILE, 1L, 0);

        // Then
        assertThat(url).contains("https://"); // presigner가 실제로 만들었는지 확인
    }

    @Test
    @DisplayName("✅ 파일 삭제 성공")
    void testDeleteFile() {
        // Given
        FileMetadata metadata = FileMetadata.builder()
                .id(1L)
                .category(FileCategory.IMAGES)
                .relatedType(RelatedType.USER_PROFILE)
                .resourceType("png")
                .relatedId(1L)
                .sequence(0)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(repository.findFirstByCategoryAndRelatedTypeAndRelatedIdAndSequenceOrderByUploadedAtDesc(
                FileCategory.IMAGES, RelatedType.USER_PROFILE, 1L, 0))
                .thenReturn(Optional.of(metadata));

        // When
        s3Service.deleteFile(FileCategory.IMAGES, RelatedType.USER_PROFILE, 1L, 0);

        // Then
        verify(s3Client).deleteObject(any(DeleteObjectRequest.class));
        verify(repository).deleteById(1L);
    }
}
