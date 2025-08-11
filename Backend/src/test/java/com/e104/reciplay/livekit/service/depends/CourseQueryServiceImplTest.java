package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.qna.service.QnaQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
import com.e104.reciplay.user.instructor.service.*;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.subscription.service.SubscriptionQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstructorQueryServiceImplTest {

    @Mock private UserQueryService userQueryService;
    @Mock private InstructorRepository instructorRepository;
    @Mock private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock private S3Service s3Service;
    @Mock private InstructorLicenseQueryService instructorLicenseQueryService;
    @Mock private CareerQueryService careerQueryService;
    @Mock private LicenseQueryService licenseQueryService;
    @Mock private SubscriptionQueryService subscriptionQueryService;
    @Mock private InstructorStatQueryService instructorStatQueryService;
    @Mock private QnaQueryService qnaQueryService;

    @InjectMocks
    private InstructorQueryServiceImpl service;

    @Test
    @DisplayName("queryInstructorByEmail - 성공")
    void queryInstructorByEmail_ok() {
        String email = "inst@example.com";
        Long userId = 10L;
        User mockUser = mock(User.class);
        when(mockUser.getId()).thenReturn(userId);
        when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

        Instructor inst = buildInstructor(7L, userId);
        when(instructorRepository.findByUserId(userId)).thenReturn(Optional.of(inst));

        Instructor result = service.queryInstructorByEmail(email);

        assertThat(result).isSameAs(inst);
        verify(userQueryService).queryUserByEmail(email);
        verify(instructorRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("queryInstructorByEmail - 강사 아님 -> IllegalArgumentException")
    void queryInstructorByEmail_notInstructor() {
        String email = "noninst@example.com";
        Long userId = 99L;
        User mockUser = mock(User.class);
        when(mockUser.getId()).thenReturn(userId);
        when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);
        when(instructorRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.queryInstructorByEmail(email));
    }

    @Test
    @DisplayName("queryInstructorIdByEmail - 성공")
    void queryInstructorIdByEmail_ok() {
        String email = "inst2@example.com";
        when(instructorRepository.findIdByEmail(email)).thenReturn(123L);

        Long id = service.queryInstructorIdByEmail(email);

        assertThat(id).isEqualTo(123L);
        verify(instructorRepository).findIdByEmail(email);
    }

    @Test
    @DisplayName("queryNameByInstructorId - 성공")
    void queryNameByInstructorId_ok() {
        Long instructorId = 5L;
        when(instructorRepository.findNameById(instructorId)).thenReturn("홍길동");

        String name = service.queryNameByInstructorId(instructorId);

        assertThat(name).isEqualTo("홍길동");
        verify(instructorRepository).findNameById(instructorId);
    }

    @Test
    @DisplayName("queryInstructorById - 성공")
    void queryInstructorById_ok() {
        Long instructorId = 7L;
        Instructor inst = buildInstructor(instructorId, 1L);
        when(instructorRepository.findById(instructorId)).thenReturn(Optional.of(inst));

        Instructor result = service.queryInstructorById(instructorId);

        assertThat(result).isSameAs(inst);
        verify(instructorRepository).findById(instructorId);
    }

    @Test
    @DisplayName("queryInstructorById - 미존재 -> EmailNotFoundException")
    void queryInstructorById_notFound() {
        Long instructorId = 404L;
        when(instructorRepository.findById(instructorId)).thenReturn(Optional.empty());

        assertThrows(EmailNotFoundException.class, () -> service.queryInstructorById(instructorId));
    }

    @Test
    @DisplayName("queryInstructorProfile - 프로필/배너/라이선스/커리어/구독정보까지 설정")
            void queryInstructorProfile_ok() {
        Long instructorId = 10L;
        Long userId = 20L;

        Instructor inst = buildInstructor(instructorId, 999L);
        when(instructorRepository.findById(instructorId)).thenReturn(Optional.of(inst));

        FileMetadata profileMeta = FileMetadata.builder().relatedId(instructorId).sequence(1).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(instructorId, "user_profile"))
                .thenReturn(profileMeta);
        ResponseFileInfo profileInfo = mock(ResponseFileInfo.class);
        when(s3Service.getResponseFileInfo(profileMeta)).thenReturn(profileInfo);

        FileMetadata bannerMeta = FileMetadata.builder().relatedId(instructorId).sequence(2).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(instructorId, "instructor_banner"))
                .thenReturn(bannerMeta);
        ResponseFileInfo bannerInfo = mock(ResponseFileInfo.class);
        when(s3Service.getResponseFileInfo(bannerMeta)).thenReturn(bannerInfo);

        InstructorLicense lic1 = InstructorLicense.builder()
                .instructorId(instructorId)
                .licenseId(1L)
                .build();
        when(instructorLicenseQueryService.queryLicensesByInstructorId(instructorId))
                .thenReturn(List.of(lic1));

        License licenseEntity = mock(License.class);
        when(licenseEntity.getName()).thenReturn("조리사 자격증");
        when(licenseQueryService.queryLicenseById(1L)).thenReturn(licenseEntity);

        Career career = Career.builder()
                .instructorId(instructorId)
                .companyName("요리연구소")
                .position("셰프")
                .startDate(LocalDate.of(2020,1,1))
                .endDate(LocalDate.of(2023,12,31))
                .build();
        when(careerQueryService.queryCarrersByInstructorId(instructorId))
                .thenReturn(List.of(career));

        when(subscriptionQueryService.isSubscribedInstructor(instructorId, userId)).thenReturn(true);
        when(subscriptionQueryService.countSubscribers(instructorId)).thenReturn(321L);

        when(instructorRepository.findNameById(instructorId)).thenReturn("김셰프");

        InstructorProfile profile = service.queryInstructorProfile(instructorId, userId);

        assertThat(profile.getInstructorProfileFileInfo()).isSameAs(profileInfo);
        assertThat(profile.getInstructorBannerFileInfo()).isSameAs(bannerInfo);
        assertThat(profile.getIsSubscribed()).isTrue();
        assertThat(profile.getSubscriberCount()).isEqualTo(321);
        assertThat(profile.getName()).isEqualTo("김셰프");
        assertThat(profile.getIntroduction()).isEqualTo(inst.getIntroduction());
        assertThat(profile.getLicenses()).hasSize(1);
        assertThat(profile.getCareers()).hasSize(1);

        verify(instructorRepository).findById(instructorId);
        verify(subFileMetadataQueryService).queryMetadataByCondition(instructorId, "user_profile");
        verify(subFileMetadataQueryService).queryMetadataByCondition(instructorId, "instructor_banner");
        verify(s3Service).getResponseFileInfo(profileMeta);
        verify(s3Service).getResponseFileInfo(bannerMeta);
        verify(instructorLicenseQueryService).queryLicensesByInstructorId(instructorId);
        verify(licenseQueryService).queryLicenseById(1L);
        verify(careerQueryService).queryCarrersByInstructorId(instructorId);
        verify(subscriptionQueryService).isSubscribedInstructor(instructorId, userId);
        verify(subscriptionQueryService).countSubscribers(instructorId);
        verify(instructorRepository).findNameById(instructorId);
    }

    @Test
    @DisplayName("queryInstructorStatistic - 총 수강생/평점/리뷰/구독/프로필이미지/새 질문 목록")
    void queryInstructorStatistic_ok() {
        Long instructorId = 77L;

        when(instructorStatQueryService.queryTotalStudents(instructorId)).thenReturn(1000);
        when(instructorStatQueryService.queryAvgStars(instructorId)).thenReturn(4.7);
        when(instructorStatQueryService.queryTotalReviewCount(instructorId)).thenReturn(222);
        when(instructorStatQueryService.querySubsciberCount(instructorId)).thenReturn(555);

        FileMetadata profileMeta = FileMetadata.builder().relatedId(instructorId).sequence(1).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(instructorId, "user_profile"))
                .thenReturn(profileMeta);
        ResponseFileInfo fileInfo = mock(ResponseFileInfo.class);
        when(s3Service.getResponseFileInfo(profileMeta)).thenReturn(fileInfo);

        InstructorQuestion q1 = InstructorQuestion.builder()
                .id(1L).courseId(10L).courseName("한식A")
                .title("질문1").questionAt(LocalDateTime.now()).build();
        when(qnaQueryService.queryQuestionsByInstructorId(instructorId))
                .thenReturn(List.of(q1));

        InstructorStat stat = service.queryInstructorStatistic(instructorId);

        assertThat(stat.getTotalStudents()).isEqualTo(1000);
        assertThat(stat.getAverageStars()).isEqualTo(4.7);
        assertThat(stat.getTotalReviewCount()).isEqualTo(222);
        assertThat(stat.getSubscriberCount()).isEqualTo(555);
        assertThat(stat.getProfileFileInfo()).isSameAs(fileInfo);
        assertThat(stat.getNewQuestions()).hasSize(1);

        verify(instructorStatQueryService).queryTotalStudents(instructorId);
        verify(instructorStatQueryService).queryAvgStars(instructorId);
        verify(instructorStatQueryService).queryTotalReviewCount(instructorId);
        verify(instructorStatQueryService).querySubsciberCount(instructorId);
        verify(subFileMetadataQueryService).queryMetadataByCondition(instructorId, "user_profile");
        verify(s3Service).getResponseFileInfo(profileMeta);
        verify(qnaQueryService).queryQuestionsByInstructorId(instructorId);
    }

    private Instructor buildInstructor(Long instructorId, Long userId) {
        return Instructor.builder()
                .id(instructorId)
                .userId(userId)
                .introduction("안녕하세요, 강사 소개입니다.")
                .isApproved(true)
                .address("서울시 어딘가")
                .phoneNumber("010-0000-0000")
                .registeredAt(LocalDateTime.now())
                .build();
    }
}
