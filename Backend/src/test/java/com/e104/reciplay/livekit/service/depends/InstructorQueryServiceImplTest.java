package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.qna.service.QnaQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.TrendPoint;
import com.e104.reciplay.user.instructor.dto.response.TrendResponse;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
import com.e104.reciplay.user.instructor.service.CareerQueryService;
import com.e104.reciplay.user.instructor.service.InstructorLicenseQueryService;
import com.e104.reciplay.user.instructor.service.InstructorStatQueryService;
import com.e104.reciplay.user.instructor.service.LicenseQueryService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.subscription.dto.SubscribedInstructorItem;
import com.e104.reciplay.user.subscription.service.SubscriptionHistoryQueryService;
import com.e104.reciplay.user.subscription.service.SubscriptionQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
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
    @Mock private SubscriptionHistoryQueryService subscriptionHistoryService;

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

        // instructor.getUserId() 사용
        Long instructorUserId = 999L;
        Instructor inst = buildInstructor(instructorId, instructorUserId);
        when(instructorRepository.findById(instructorId)).thenReturn(Optional.of(inst));

        // 프로필: relatedId = instructorUserId, key="USER_PROFILE" (대문자)
        FileMetadata profileMeta = FileMetadata.builder().relatedId(instructorUserId).sequence(1).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(instructorUserId, "USER_PROFILE"))
                .thenReturn(profileMeta);
        ResponseFileInfo profileInfo = mock(ResponseFileInfo.class);
        when(s3Service.getResponseFileInfo(profileMeta)).thenReturn(profileInfo);

        // 배너: relatedId = instructorId, key="INSTRUCTOR_BANNER" (대문자)
        FileMetadata bannerMeta = FileMetadata.builder().relatedId(instructorId).sequence(2).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(instructorId, "INSTRUCTOR_BANNER"))
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
        verify(subFileMetadataQueryService).queryMetadataByCondition(instructorUserId, "USER_PROFILE");       // ✅ 대문자
        verify(subFileMetadataQueryService).queryMetadataByCondition(instructorId, "INSTRUCTOR_BANNER");      // ✅ 대문자
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
        Long userId = 1L;

        when(instructorStatQueryService.queryTotalStudents(instructorId)).thenReturn(1000);
        when(instructorStatQueryService.queryAvgStars(instructorId)).thenReturn(4.7);
        when(instructorStatQueryService.queryTotalReviewCount(instructorId)).thenReturn(222);
        when(instructorStatQueryService.querySubsciberCount(instructorId)).thenReturn(555);

        // 구현은 instructorId + "USER_PROFILE"
        FileMetadata profileMeta = FileMetadata.builder().relatedId(instructorId).sequence(1).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(userId, "USER_PROFILE"))
                .thenReturn(profileMeta);
        ResponseFileInfo fileInfo = mock(ResponseFileInfo.class);
        when(s3Service.getResponseFileInfo(profileMeta)).thenReturn(fileInfo);

        InstructorQuestion q1 = InstructorQuestion.builder()
                .id(1L).courseId(10L).courseName("한식A")
                .title("질문1").questionAt(LocalDateTime.now()).build();
        when(qnaQueryService.queryQuestionsByInstructorId(instructorId))
                .thenReturn(List.of(q1));
        when(instructorRepository.findById(any())).thenReturn(Optional.of(Instructor.builder().id(instructorId).userId(userId).build()));
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
        verify(subFileMetadataQueryService).queryMetadataByCondition(userId, "USER_PROFILE"); // ✅ 대문자
        verify(s3Service).getResponseFileInfo(profileMeta);
        verify(qnaQueryService).queryQuestionsByInstructorId(instructorId);
    }

    @Test
    @DisplayName("queryUserSubscriptionsByUserId - 구독 목록을 SubscribedInstructorItem 리스트로 조립")
    void queryUserSubscriptionsByUserId_ok() {
        Long userId = 1L;

        Subscription sub1 = Subscription.builder().instructorId(100L).userId(userId).build();
        Subscription sub2 = Subscription.builder().instructorId(200L).userId(userId).build();
        given(subscriptionQueryService.querySubscriptionsByUserId(userId))
                .willReturn(List.of(sub1, sub2));

        // 강사 100, 200의 userId
        Instructor inst100 = buildInstructor(100L, 1000L);
        Instructor inst200 = buildInstructor(200L, 2000L);
        given(instructorRepository.findById(100L)).willReturn(Optional.of(inst100));
        given(instructorRepository.findById(200L)).willReturn(Optional.of(inst200));

        // 프로필 메타/이미지 (USER_PROFILE 대문자)
        FileMetadata fm100 = FileMetadata.builder().relatedId(1000L).sequence(1).build();
        FileMetadata fm200 = FileMetadata.builder().relatedId(2000L).sequence(1).build();
        given(subFileMetadataQueryService.queryMetadataByCondition(1000L, "USER_PROFILE")).willReturn(fm100);
        given(subFileMetadataQueryService.queryMetadataByCondition(2000L, "USER_PROFILE")).willReturn(fm200);

        ResponseFileInfo r100 = mock(ResponseFileInfo.class);
        ResponseFileInfo r200 = mock(ResponseFileInfo.class);
        given(s3Service.getResponseFileInfo(fm100)).willReturn(r100);
        given(s3Service.getResponseFileInfo(fm200)).willReturn(r200);

        // 이름, 구독자 수
        given(instructorRepository.findNameById(100L)).willReturn("Alice");
        given(instructorRepository.findNameById(200L)).willReturn("Bob");
        given(subscriptionHistoryService.querySubscriberCount(100L)).willReturn(11);
        given(subscriptionHistoryService.querySubscriberCount(200L)).willReturn(22);

        List<SubscribedInstructorItem> list = service.queryUserSubscriptionsByUserId(userId);

        assertThat(list).hasSize(2);
        SubscribedInstructorItem i1 = list.get(0);
        SubscribedInstructorItem i2 = list.get(1);

        assertThat(i1.getInstructorId()).isEqualTo(100L);
        assertThat(i1.getInstructorName()).isEqualTo("Alice");
        assertThat(i1.getSubscriberCount()).isEqualTo(11L);
        assertThat(i1.getInstructorProfileFileInfo()).isSameAs(r100);

        assertThat(i2.getInstructorId()).isEqualTo(200L);
        assertThat(i2.getInstructorName()).isEqualTo("Bob");
        assertThat(i2.getSubscriberCount()).isEqualTo(22L);
        assertThat(i2.getInstructorProfileFileInfo()).isSameAs(r200);

        verify(subscriptionQueryService).querySubscriptionsByUserId(userId);
        verify(instructorRepository).findById(100L);
        verify(instructorRepository).findById(200L);
        verify(subFileMetadataQueryService).queryMetadataByCondition(1000L, "USER_PROFILE"); // ✅ 대문자
        verify(subFileMetadataQueryService).queryMetadataByCondition(2000L, "USER_PROFILE"); // ✅ 대문자
        verify(s3Service).getResponseFileInfo(fm100);
        verify(s3Service).getResponseFileInfo(fm200);
        verify(instructorRepository).findNameById(100L);
        verify(instructorRepository).findNameById(200L);
        verify(subscriptionHistoryService).querySubscriberCount(100L);
        verify(subscriptionHistoryService).querySubscriberCount(200L);
    }

    @Test
    @DisplayName("queryUserSubscriptionsByUserId - 구독이 없으면 빈 리스트 반환, 다른 의존성 호출 없음")
    void queryUserSubscriptionsByUserId_empty() {
        Long userId = 1L;
        given(subscriptionQueryService.querySubscriptionsByUserId(userId)).willReturn(List.of());

        List<SubscribedInstructorItem> list = service.queryUserSubscriptionsByUserId(userId);

        assertThat(list).isEmpty();
        verify(subscriptionQueryService).querySubscriptionsByUserId(userId);
        verifyNoInteractions(instructorRepository, subFileMetadataQueryService, s3Service, subscriptionHistoryService);
    }

    @Test
    @DisplayName("querySubscriberTrends - day/week/month 별 targetDates 및 TrendPoint 목록 생성")
    void querySubscriberTrends_ok() {
        Long instructorId = 10L;
        LocalDate today = LocalDate.now();

        // 1. criteria = "day" → 지난 1달간 매일
        String criteria = "day";
        List<LocalDate> expectedDates = new ArrayList<>();
        LocalDate from = today.minusMonths(1);
        for (LocalDate d = from; !d.isAfter(today); d = d.plusDays(1)) {
            expectedDates.add(d);
        }

        List<TrendPoint> mockPoints = expectedDates.stream()
                .map(date -> new TrendPoint(date, 100L))
                .toList();

        when(subscriptionHistoryService.queryTrendPoints(instructorId, expectedDates)).thenReturn(mockPoints);

        TrendResponse response = service.querySubscriberTrends(criteria, instructorId);

        assertThat(response.getCriteria()).isEqualTo("day");
        assertThat(response.getFrom()).isEqualTo(from);
        assertThat(response.getTo()).isEqualTo(today);
        assertThat(response.getSeries()).hasSize(expectedDates.size());
        assertThat(response.getSeries().get(0).getT()).isInstanceOf(LocalDate.class); // 👈 여기가 포인트
        assertThat(response.getSeries().get(0).getSubscribers()).isEqualTo(100L);

        verify(subscriptionHistoryService).queryTrendPoints(instructorId, expectedDates);
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
