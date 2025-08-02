package com.e104.reciplay.s3.controller;

import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.filter.CharacterEncodingFilter;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class S3ControllerTest {

    private MockMvc mockMvc;
    private S3Service s3Service;

    @BeforeEach
    void setUp() {
        s3Service = Mockito.mock(S3Service.class);
        S3Controller s3Controller = new S3Controller(s3Service);
        mockMvc = MockMvcBuilders.standaloneSetup(s3Controller)
                .addFilter(new CharacterEncodingFilter("UTF-8", true)) // 한글 응답 처리
                .build();
    }

    @Test
    @DisplayName(" 파일 업로드 성공")
    void uploadFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.png", MediaType.IMAGE_PNG_VALUE, "data".getBytes());
        String path = "images/recipe/1.png";

        Mockito.when(s3Service.uploadFile(any(), any(), any(), anyLong(), anyInt()))
                .thenReturn(path);

        mockMvc.perform(multipart("/api/v1/files")
                        .file(file)
                        .param("category", FileCategory.IMAGES.name())
                        .param("relatedType", RelatedType.USER_PROFILE.name())
                        .param("relatedId", "1")
                        .param("sequence", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("파일 업로드에 성공하였습니다."))
                .andExpect(jsonPath("$.data").value(path));
    }

    @Test
    @DisplayName(" Presigned URL 조회 성공")
    void getPresignedUrl() throws Exception {
        String url = "https://s3.bucket/abc123.png";

        Mockito.when(s3Service.getPresignedUrl(any(), any(), anyLong(), anyInt()))
                .thenReturn(url);

        mockMvc.perform(get("/api/v1/files")
                        .param("category", FileCategory.IMAGES.name())
                        .param("relatedType", RelatedType.USER_PROFILE.name())
                        .param("relatedId", "1")
                        .param("sequence", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Presigned Url 생성에 성공하였습니다."))
                .andExpect(jsonPath("$.data").value(url));
    }

    @Test
    @DisplayName(" 파일 삭제 성공")
    void deleteFile() throws Exception {
        doNothing().when(s3Service).deleteFile(any(), any(), anyLong(), anyInt());

        mockMvc.perform(delete("/api/v1/files")
                        .param("category", FileCategory.IMAGES.name())
                        .param("relatedType", RelatedType.USER_PROFILE.name())
                        .param("relatedId", "1")
                        .param("sequence", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("파일이 성공적으로 삭제되었습니다."))
                .andExpect(jsonPath("$.data").doesNotExist());
    }
}
