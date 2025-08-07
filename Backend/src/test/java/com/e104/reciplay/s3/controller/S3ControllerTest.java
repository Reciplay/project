package com.e104.reciplay.s3.controller;

import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class S3ControllerTest {

    private MockMvc mockMvc;

    @InjectMocks
    private S3Controller s3Controller;

    @Mock
    private S3Service s3Service;

    @BeforeEach
    void setup() {
        s3Service = mock(S3Service.class);
        s3Controller = new S3Controller(s3Service);
        mockMvc = MockMvcBuilders.standaloneSetup(s3Controller).build();
    }

    @Test
    void testUploadFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "data".getBytes());

        mockMvc.perform(multipart("/api/v1/files")
                        .file(file)
                        .param("relatedId", "123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("파일 업로드에 성공하였습니다."));

        verify(s3Service).uploadFile(any(), eq(FileCategory.IMAGES), eq(RelatedType.USER_PROFILE), eq(123L), eq(1));
    }

    @Test
    void testGetPresignedUrl() throws Exception {
        ResponseFileInfo fileInfo = new ResponseFileInfo();
        fileInfo.setName("sample.jpg");
        fileInfo.setPresignedUrl("https://example.com/test");

        when(s3Service.getResponseFileInfo(FileCategory.IMAGES, RelatedType.USER_PROFILE, 100L, 1))
                .thenReturn(fileInfo);

        mockMvc.perform(get("/api/v1/files")
                        .param("category", "IMAGES")
                        .param("relatedType", "USER_PROFILE")
                        .param("relatedId", "100")
                        .param("sequence", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("sample.jpg"))
                .andExpect(jsonPath("$.data.presigedUrl").value("https://example.com/test"))
                .andExpect(jsonPath("$.message").value("Presigned Url 생성에 성공하였습니다."));
    }

    @Test
    void testDeleteFile() throws Exception {
        mockMvc.perform(delete("/api/v1/files")
                        .param("category", "IMAGES")
                        .param("relatedType", "USER_PROFILE")
                        .param("relatedId", "100")
                        .param("sequence", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("파일이 성공적으로 삭제되었습니다."));

        verify(s3Service).deleteFile(FileCategory.IMAGES, RelatedType.USER_PROFILE, 100L, 1);
    }
}
