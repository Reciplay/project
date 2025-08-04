package com.e104.reciplay.s3.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class S3ServiceImplTest {

    @InjectMocks
    private S3ServiceImpl s3Service;

    @Mock
    private S3Client s3Client;

    @Mock
    private FileMetadataRepository repository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock 환경 변수 수동 주입
        ReflectionTestUtils.setField(s3Service, "accessKey", "test-access");
        ReflectionTestUtils.setField(s3Service, "secretKey", "test-secret");
        ReflectionTestUtils.setField(s3Service, "bucket", "test-bucket");
        ReflectionTestUtils.setField(s3Service, "region", "ap-northeast-2");
    }

    @Test
    @DisplayName("파일 업로드 성공")
    void testUploadFile() throws IOException {
        // given
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "image data".getBytes()
        );

        FileMetadata savedMetadata = FileMetadata.builder()
                .id(10L)
                .category(FileCategory.IMAGES)
                .resourceType("jpg")
                .relatedType(RelatedType.USER_PROFILE)
                .relatedId(5L)
                .sequence(1)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(repository.save(any(FileMetadata.class))).thenReturn(savedMetadata);

        // when
        s3Service.uploadFile(mockFile, FileCategory.IMAGES, RelatedType.USER_PROFILE, 5L, 1);

        // then
        verify(repository, times(1)).save(any(FileMetadata.class));
        verify(s3Client, times(1)).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    @DisplayName("파일 삭제 성공")
    void testDeleteFileSuccess() {
        // given
        FileMetadata metadata = FileMetadata.builder()
                .id(1L)
                .category(FileCategory.IMAGES)
                .relatedType(RelatedType.USER_PROFILE)
                .relatedId(5L)
                .sequence(1)
                .resourceType("png")
                .uploadedAt(LocalDateTime.now())
                .build();

        when(repository.findMetadata(FileCategory.IMAGES, RelatedType.USER_PROFILE, 5L, 1))
                .thenReturn(Optional.of(metadata));

        // when
        s3Service.deleteFile(FileCategory.IMAGES, RelatedType.USER_PROFILE, 5L, 1);

        // then
        verify(s3Client, times(1)).deleteObject(any(DeleteObjectRequest.class));
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("파일 삭제 실패 시 예외 발생")
    void testDeleteFileNotFound() {
        // given
        when(repository.findMetadata(FileCategory.IMAGES, RelatedType.USER_PROFILE, 5L, 1))
                .thenReturn(Optional.empty());

        // when & then
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                s3Service.deleteFile(FileCategory.IMAGES, RelatedType.USER_PROFILE, 5L, 1));
        assertEquals("삭제할 파일을 찾을 수 없습니다.", ex.getMessage());
    }
}
