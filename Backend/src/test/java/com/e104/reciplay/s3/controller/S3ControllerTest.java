package com.e104.reciplay.s3.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class S3ControllerUnitTest {

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private S3Controller s3Controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("파일 업로드 성공")
    void testUploadFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.png", "image/png", "dummy-image".getBytes()
        );

        doNothing().when(s3Service).uploadFile(
                eq(file),
                eq(FileCategory.IMAGES),
                eq(RelatedType.USER_PROFILE),
                eq(123L),
                eq(1)
        );

        ResponseEntity<?> response = s3Controller.upload(
                file,
                FileCategory.IMAGES,
                RelatedType.USER_PROFILE,
                123L,
                1
        );

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().toString()).contains("파일 업로드에 성공하였습니다.");

        verify(s3Service, times(1)).uploadFile(file, FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1);
    }

    @Test
    @DisplayName("Presigned URL 반환 성공")
    void testGetPresignedUrl() {
        String expectedUrl = "https://mock-url.com";
        when(s3Service.getPresignedUrl(FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1))
                .thenReturn(expectedUrl);

        ResponseEntity<ResponseRoot<String>> response = s3Controller.getPresignedUrl(
                FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1
        );

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().getData()).isEqualTo(expectedUrl);
        assertThat(response.getBody().getMessage()).contains("Presigned Url 생성에 성공하였습니다.");

        verify(s3Service, times(1)).getPresignedUrl(FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1);
    }

    @Test
    @DisplayName("파일 삭제 성공")
    void testDeleteFile() {
        doNothing().when(s3Service).deleteFile(FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1);

        ResponseEntity<ResponseRoot<String>> response = s3Controller.deleteFile(
                FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1
        );

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().getMessage()).contains("파일이 성공적으로 삭제되었습니다.");

        verify(s3Service, times(1)).deleteFile(FileCategory.IMAGES, RelatedType.USER_PROFILE, 123L, 1);
    }
}
