
package com.e104.reciplay.user.profile.service;

import com.e104.reciplay.entity.Category;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Level;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.dto.response.ProfileInformation;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MyProfileQueryServiceImplTest {

    @InjectMocks
    private MyProfileQueryServiceImpl myProfileQueryService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private LevelQueryService levelQueryService;

    @Mock
    private CategoryQueryService categoryQueryService;

    @Mock
    private FileMetadataQueryService fileMetadataQueryService;

    @Mock
    private S3Service s3Service;

    @Test
    @DisplayName("프로필 정보 조회 테스트")
    void queryProfileInformation() {
        // given
        String email = "test@test.com";
        User user = User.builder()
                .id(1L)
                .email(email)
                .nickname("testNickname")
                .name("testName")
                .birthDate(LocalDate.now())
                .gender(1)
                .job("testJob")
                .createdAt(LocalDateTime.now())
                .isActivated(true)
                .build();

        Level level = Level.builder()
                .id(1L)
                .userId(1L)
                .categoryId(1L)
                .level(1)
                .build();


        Category category = new Category(1L, "한식");

        FileMetadata fileMetadata = new FileMetadata();

        ResponseFileInfo responseFileInfo = new ResponseFileInfo("testUrl", "testName", 1);

        given(userQueryService.queryUserByEmail(email)).willReturn(user);
        given(levelQueryService.queryUserLevelsById(user.getId())).willReturn(Collections.singletonList(level));
        given(categoryQueryService.queryCategoryById(level.getCategoryId())).willReturn(category);
        given(fileMetadataQueryService.queryUserProfilePhoto(user.getId())).willReturn(fileMetadata);
        given(s3Service.getResponseFileInfo(fileMetadata)).willReturn(responseFileInfo);

        // when
        ProfileInformation profileInformation = myProfileQueryService.queryProfileInformation(email);

        System.out.println(profileInformation);
        // then
        assertThat(profileInformation).isNotNull();
        assertThat(profileInformation.getEmail()).isEqualTo(email);
        assertThat(profileInformation.getNickname()).isEqualTo("testNickname");
        assertThat(profileInformation.getName()).isEqualTo("testName");
        assertThat(profileInformation.getLevels()).hasSize(1);
        assertThat(profileInformation.getLevels().get(0).getCategory()).isEqualTo("한식");
        assertThat(profileInformation.getProfileImage().getPresigedUrl()).isEqualTo("testUrl");

        verify(userQueryService).queryUserByEmail(email);
        verify(levelQueryService).queryUserLevelsById(user.getId());
        verify(categoryQueryService).queryCategoryById(level.getCategoryId());
        verify(fileMetadataQueryService).queryUserProfilePhoto(user.getId());
        verify(s3Service).getResponseFileInfo(fileMetadata);
    }
}
