package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.courses.service.ZzimQueryService;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.lecture_history.service.PersonalStatService;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseQueryServiceImplTest {

    @Mock private CourseRepository courseRepository;
    @Mock private CanLearnQueryService canLearnQueryService;
    @Mock private ReviewQueryService reviewQueryService;
    @Mock private CategoryQueryService categoryQueryService;
    @Mock private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock private ZzimQueryService zzimQueryService;
    @Mock private CourseHistoryQueryService courseHistoryQueryService;
    @Mock private S3Service s3Service;
    @Mock private InstructorQueryService instructorQueryService;
    @Mock private UserQueryService userQueryService;
    @Mock private PersonalStatService personalStatService;

    @InjectMocks
    private CourseQueryServiceImpl service;

    // --------- 유틸: 테스트용 Course 빌더 ---------
    private Course course(Long id, Long instructorId) {
        Course c = new Course();
        c.setId(id);
        c.setInstructorId(instructorId);
        c.setTitle("테스트 강좌 " + id);
        c.setCategoryId(10L);
        c.setCourseStartDate(LocalDate.now().minusDays(3));
        c.setCourseEndDate(LocalDate.now().plusDays(3));
        c.setEnrollmentStartDate(LocalDateTime.now().minusDays(10));
        c.setEnrollmentEndDate(LocalDateTime.now().plusDays(1));
        c.setIsApproved(true);
        c.setMaxEnrollments(100);
        c.setLevel(5);
        return c;
    }

    @Nested
    class QueryCourseById {
        @Test @DisplayName("존재하는 강좌 조회 성공")
        void ok() {
            Course c = course(1L, 99L);
            when(courseRepository.findById(1L)).thenReturn(Optional.of(c));

            Course found = service.queryCourseById(1L);

            assertThat(found).isSameAs(c);
        }

        @Test @DisplayName("없는 강좌 -> IllegalArgumentException")
        void notFound() {
            when(courseRepository.findById(9L)).thenReturn(Optional.empty());
            assertThrows(IllegalArgumentException.class, () -> service.queryCourseById(9L));
        }
    }

    @Nested
    class QueryCourseDetailsByInstructorId {
        @Test @DisplayName("soon 코스 리스트 → CourseDetail 리스트 변환")
        void soon() {
            Long instId = 7L;
            // soon 전용 쿼리
            Course soon1 = course(11L, instId);
            Course soon2 = course(12L, instId);
            when(courseRepository.findSoonCourseByInstructorId(instId)).thenReturn(List.of(soon1, soon2));

            // collect 내부에서 사용되는 의존성 스텁
            when(canLearnQueryService.queryContentsByCourseId(anyLong())).thenReturn(List.of("칼질", "불조절"));
            when(reviewQueryService.countReviewsByCourseId(anyLong())).thenReturn(3);
            when(reviewQueryService.avgStarsByCourseId(anyLong())).thenReturn(4.5);
            when(categoryQueryService.queryNameByCourseId(anyLong())).thenReturn("한식");

            // 썸네일 메타데이터 + S3 presigned
            FileMetadata thumb = FileMetadata.builder().id(100L).relatedId(11L).sequence(1).build();
            when(subFileMetadataQueryService.queryMetadataListByCondition(anyLong(), eq("THUMBNAIL")))
                    .thenReturn(List.of(thumb));
            when(s3Service.getResponseFileInfo(eq(thumb))).thenReturn(new ResponseFileInfo("url", "name", 1));

            // 커버는 원본 코드상 null로 흘러갈 수 있으니 따로 스텁 불필요

            List<CourseDetail> result = service.queryCourseDetailsByInstructorId(instId, "soon");

            assertThat(result).hasSize(2);
            assertThat(result.get(0).getCategory()).isEqualTo("한식");
            assertThat(result.get(0).getThumbnailFileInfos()).hasSize(1);
        }

        @Test @DisplayName("ongoing / end 도 정상 동작")
        void ongoing_end() {
            Long instId = 8L;
            when(courseRepository.findOngoingCourseByInstructorId(instId)).thenReturn(List.of(course(21L, instId)));
            when(courseRepository.findEndedCourseByInstructorId(instId)).thenReturn(List.of(course(31L, instId)));

            when(canLearnQueryService.queryContentsByCourseId(anyLong())).thenReturn(List.of());
            when(reviewQueryService.countReviewsByCourseId(anyLong())).thenReturn(0);
            when(reviewQueryService.avgStarsByCourseId(anyLong())).thenReturn(0.0);
            when(categoryQueryService.queryNameByCourseId(anyLong())).thenReturn("기타");
            when(subFileMetadataQueryService.queryMetadataListByCondition(anyLong(), eq("THUMBNAIL")))
                    .thenReturn(List.of());

            assertThat(service.queryCourseDetailsByInstructorId(instId, "ongoing")).hasSize(1);
            assertThat(service.queryCourseDetailsByInstructorId(instId, "end")).hasSize(1);
        }

        @Test @DisplayName("잘못된 상태값 -> IllegalArgumentException")
        void badStatus() {
            assertThrows(IllegalArgumentException.class, () -> service.queryCourseDetailsByInstructorId(1L, "WRONG"));
        }
    }

    @Nested
    class QueryCourseDetailByCourseId {
        @Test @DisplayName("userId 존재: zzim/enrolled/reviewed 및 강사 사용자 정보까지 세팅")
        void withUser() {
            Long courseId = 100L;
            Long instId = 55L;
            Long instUserId = 555L;
            Course c = course(courseId, instId);
            when(courseRepository.findById(courseId)).thenReturn(Optional.of(c));

            when(canLearnQueryService.queryContentsByCourseId(courseId)).thenReturn(List.of("칼질"));
            when(reviewQueryService.countReviewsByCourseId(courseId)).thenReturn(10);
            when(reviewQueryService.avgStarsByCourseId(courseId)).thenReturn(4.2);
            when(categoryQueryService.queryNameByCourseId(courseId)).thenReturn("한식");
            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAIL")).thenReturn(List.of());
            // s3Service.getResponseFileInfo(null) 호출 가능성 → 기본값 null 허용

            Long userId = 1L;
            when(zzimQueryService.isZzimed(courseId, userId)).thenReturn(true);
            when(courseHistoryQueryService.enrolled(courseId, userId)).thenReturn(true);
            when(reviewQueryService.isReviewed(courseId, userId)).thenReturn(false);

            Instructor inst = new Instructor();
            inst.setId(instId);
            inst.setUserId(instUserId);
            when(instructorQueryService.queryInstructorById(instId)).thenReturn(inst);

            User u = User.builder().id(instUserId).email("inst@test.com").name("홍길동").nickname("길동쌤").build();
            when(userQueryService.queryUserById(instUserId)).thenReturn(u);

            CourseDetail d = service.queryCourseDetailByCourseId(courseId, userId);

            assertThat(d.getIsZzimed()).isTrue();
            assertThat(d.getIsEnrolled()).isTrue();
            assertThat(d.getIsReviwed()).isFalse();
            assertThat(d.getInstructorEmail()).isEqualTo("inst@test.com");
            assertThat(d.getInstructorName()).isEqualTo("홍길동");
            assertThat(d.getInstructorNickname()).isEqualTo("길동쌤");
        }

        @Test @DisplayName("userId null: 사용자 관련 플래그는 전부 false")
        void withoutUser() {
            Long courseId = 101L;
            Course c = course(courseId, 9L);
            when(courseRepository.findById(courseId)).thenReturn(Optional.of(c));

            when(canLearnQueryService.queryContentsByCourseId(courseId)).thenReturn(List.of());
            when(reviewQueryService.countReviewsByCourseId(courseId)).thenReturn(0);
            when(reviewQueryService.avgStarsByCourseId(courseId)).thenReturn(0.0);
            when(categoryQueryService.queryNameByCourseId(courseId)).thenReturn("기타");
            when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "THUMBNAIL")).thenReturn(List.of());

            Instructor inst = new Instructor();
            inst.setId(9L);
            inst.setUserId(90L);
            when(instructorQueryService.queryInstructorById(9L)).thenReturn(inst);
            when(userQueryService.queryUserById(90L)).thenReturn(User.builder().id(90L).email("a@a.com").name("A").nickname("AA").build());

            CourseDetail d = service.queryCourseDetailByCourseId(courseId, null);

            assertThat(d.getIsZzimed()).isFalse();
            assertThat(d.getIsEnrolled()).isFalse();
            assertThat(d.getIsReviwed()).isFalse();
        }
    }

    @Nested
    class FlagsAndPeriods {
        @Test @DisplayName("isClosedCourse: 시작 전 또는 종료 후 또는 미승인")
        void isClosedCourse() {
            Course c1 = course(1L, 1L);
            c1.setCourseStartDate(LocalDate.now().plusDays(1)); // 시작 전
            when(courseRepository.findById(1L)).thenReturn(Optional.of(c1));
            assertTrue(service.isClosedCourse(1L));

            Course c2 = course(2L, 1L);
            c2.setCourseEndDate(LocalDate.now().minusDays(1)); // 종료 후
            when(courseRepository.findById(2L)).thenReturn(Optional.of(c2));
            assertTrue(service.isClosedCourse(2L));

            Course c3 = course(3L, 1L);
            c3.setIsApproved(false); // 미승인
            when(courseRepository.findById(3L)).thenReturn(Optional.of(c3));
            assertTrue(service.isClosedCourse(3L));

            Course c4 = course(4L, 1L); // 진행중 & 승인됨
            when(courseRepository.findById(4L)).thenReturn(Optional.of(c4));
            assertFalse(service.isClosedCourse(4L));
        }

        @Test @DisplayName("isInstructorOf: 코스의 instructorId와 사용자-강사 매핑 일치")
        void isInstructorOf() {
            Course c = course(10L, 77L);
            when(courseRepository.findById(10L)).thenReturn(Optional.of(c));

            Instructor inst = new Instructor();
            inst.setId(77L);
            when(instructorQueryService.queryInstructorByUserId(1000L)).thenReturn(inst);

            assertTrue(service.isInstructorOf(1000L, 10L));
        }

        @Test @DisplayName("isStartedCourse: 시작일이 오늘보다 이전이면 true")
        void isStartedCourse() {
            Course c = course(20L, 1L);
            c.setCourseStartDate(LocalDate.now().minusDays(1));
            when(courseRepository.findById(20L)).thenReturn(Optional.of(c));

            assertTrue(service.isStartedCourse(20L));
        }

        @Test @DisplayName("isInEnrollmentTerm: 신청 기간 내면 true")
        void isInEnrollmentTerm() {
            Course c = course(30L, 1L);
            c.setEnrollmentStartDate(LocalDateTime.now().minusDays(2));
            c.setEnrollmentEndDate(LocalDateTime.now().plusDays(2));
            when(courseRepository.findById(30L)).thenReturn(Optional.of(c));

            assertTrue(service.isInEnrollmentTerm(30L));
        }

        @Test @DisplayName("isFullyEnrolledCourse: 현재 신청 수 >= 정원")
        void isFullyEnrolledCourse() {
            Course c = course(40L, 1L);
            c.setMaxEnrollments(10);
            when(courseRepository.findById(40L)).thenReturn(Optional.of(c));
            when(courseHistoryQueryService.countEnrollmentsOf(40L)).thenReturn(10L);

            assertTrue(service.isFullyEnrolledCourse(40L));
        }
    }

    @Test
    @DisplayName("collectCourseDetailWithCommonFields: 썸네일/커버 조회 try-catch 흐름, 파일정보 채움")
    void collectCommonFields_thumbnailAndCover() {
        Course c = course(50L, 1L);

        when(canLearnQueryService.queryContentsByCourseId(50L)).thenReturn(List.of("칼질"));
        when(reviewQueryService.countReviewsByCourseId(50L)).thenReturn(5);
        when(reviewQueryService.avgStarsByCourseId(50L)).thenReturn(4.0);
        when(categoryQueryService.queryNameByCourseId(50L)).thenReturn("한식");

        FileMetadata thumb = FileMetadata.builder().id(501L).relatedId(50L).sequence(1).build();
        when(subFileMetadataQueryService.queryMetadataListByCondition(50L, "THUMBNAIL"))
                .thenReturn(List.of(thumb));
        when(s3Service.getResponseFileInfo(thumb)).thenReturn(new ResponseFileInfo("thumb-url", "t.png", 1));

        // 커버 경로에서 원본은 metadata 변수를 안 쓰고 null을 s3에 넘길 수 있음 → s3는 null시 null 반환
        when(subFileMetadataQueryService.queryMetadataByCondition(50L, "COURSE_COVER")).thenReturn(
                FileMetadata.builder().id(777L).relatedId(50L).sequence(1).build()
        );
        when(s3Service.getResponseFileInfo((FileMetadata) isNull())).thenReturn(null);

        CourseDetail d = service.collectCourseDetailWithCommonFields(c);

        assertThat(d.getCanLearns()).containsExactly("칼질");
        assertThat(d.getReviewCount()).isEqualTo(5);
        assertThat(d.getAverageReviewScore()).isEqualTo(4.0);
        assertThat(d.getCategory()).isEqualTo("한식");
        assertThat(d.getThumbnailFileInfos()).hasSize(1);
        assertThat(d.getCourseCoverFileInfo()).isNull(); // 현재 구현상 null 허용
    }

    @Test
    @DisplayName("queryCourseUsers: 히스토리의 userId로 User 조회 후 리스트 반환")
    void queryCourseUsers() {
        Long courseId = 60L;

        CourseHistory h1 = mock(CourseHistory.class);
        when(h1.getUserId()).thenReturn(100L);
        CourseHistory h2 = mock(CourseHistory.class);
        when(h2.getUserId()).thenReturn(200L);

        when(courseHistoryQueryService.queryCourseHistories(courseId)).thenReturn(List.of(h1, h2));

        User u1 = User.builder().id(100L).email("u1@test.com").build();
        User u2 = User.builder().id(200L).email("u2@test.com").build();
        when(userQueryService.queryUserById(100L)).thenReturn(u1);
        when(userQueryService.queryUserById(200L)).thenReturn(u2);

        List<User> users = service.queryCourseUsers(courseId);
        assertThat(users).containsExactly(u1, u2);
    }

    @Test
    @DisplayName("calcLevelAmount: progress * level * 0.1 → int 캐스팅")
    void calcLevelAmount() {
        Long courseId = 70L;
        String email = "student@test.com";

        Course c = course(courseId, 1L);
        c.setLevel(8); // 레벨 8
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(c));

        when(personalStatService.calcCourseProgress(courseId, email)).thenReturn(0.75); // 75% 진행

        int amount = service.calcLevelAmount(courseId, email);

        // (level * progress) * 0.1 = (8 * 0.75) * 0.1 = 0.6 -> int 캐스팅 0
        assertThat(amount).isEqualTo(0);
    }
}
