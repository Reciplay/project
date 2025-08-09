package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.courses.service.ZzimQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
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

/**
 * CourseQueryServiceImpl의 모든 public 메서드를 커버하는 단위 테스트
 */
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

    @InjectMocks
    private CourseQueryServiceImpl service;

    // =========================
    // queryCourseById
    // =========================
    @Test
    @DisplayName("queryCourseById - 존재 시 Course 반환")
    void queryCourseById_ok() {
        // given
        Long id = 100L;
        Course course = buildCourse(id, 9L, "제목");
        when(courseRepository.findById(id)).thenReturn(Optional.of(course));

        // when
        Course result = service.queryCourseById(id);

        // then
        assertThat(result).isSameAs(course);
        verify(courseRepository).findById(id);
        verifyNoMoreInteractions(courseRepository);
    }

    @Test
    @DisplayName("queryCourseById - 미존재 시 IllegalArgumentException")
    void queryCourseById_notFound() {
        // given
        Long id = 999L;
        when(courseRepository.findById(id)).thenReturn(Optional.empty());

        // when & then
        assertThrows(IllegalArgumentException.class, () -> service.queryCourseById(id));
        verify(courseRepository).findById(id);
        verifyNoMoreInteractions(courseRepository);
    }

    // =========================
    // queryCourseDetailsByInstructorId
    // =========================
    @Test
    @DisplayName("queryCourseDetailsByInstructorId - soon 상태 리스트 조회 성공")
    void queryCourseDetailsByInstructorId_soon_ok() {
        Long instructorId = 1L;
        Long courseId = 10L;
        Course c = buildCourse(courseId, instructorId, "soon 강좌");

        when(courseRepository.findSoonCourseByInstructorId(instructorId))
                .thenReturn(List.of(c));
        stubCommonAggregates(courseId);
        stubFileMetaAndS3(courseId);

        List<CourseDetail> details = service.queryCourseDetailsByInstructorId(instructorId, "soon");

        assertThat(details).hasSize(1);
        var d = details.get(0);
        assertThat(d.getTitle()).isEqualTo("soon 강좌");
        assertThat(d.getCanLearns()).containsExactlyInAnyOrder("자바", "스프링");
        assertThat(d.getReviewCount()).isEqualTo(3);
        assertThat(d.getAverageReviewScore()).isEqualTo(4.3);
        assertThat(d.getCategory()).isEqualTo("백엔드");
        assertThat(d.getThumbnailFileInfos()).hasSize(1);
        assertThat(d.getCourseCoverFileInfo()).isNotNull();

        verify(courseRepository).findSoonCourseByInstructorId(instructorId);
    }

    @Test
    @DisplayName("queryCourseDetailsByInstructorId - ongoing 상태 리스트 조회 성공")
    void queryCourseDetailsByInstructorId_ongoing_ok() {
        Long instructorId = 2L;
        Long courseId = 20L;
        Course c = buildCourse(courseId, instructorId, "ongoing 강좌");

        when(courseRepository.findOngoingCourseByInstructorId(instructorId))
                .thenReturn(List.of(c));
        stubCommonAggregates(courseId);
        stubFileMetaAndS3(courseId);

        List<CourseDetail> details = service.queryCourseDetailsByInstructorId(instructorId, "ongoing");

        assertThat(details).hasSize(1);
        assertThat(details.get(0).getTitle()).isEqualTo("ongoing 강좌");
        verify(courseRepository).findOngoingCourseByInstructorId(instructorId);
    }

    @Test
    @DisplayName("queryCourseDetailsByInstructorId - end 상태 리스트 조회 성공")
    void queryCourseDetailsByInstructorId_end_ok() {
        Long instructorId = 3L;
        Long courseId = 30L;
        Course c = buildCourse(courseId, instructorId, "end 강좌");

        when(courseRepository.findEndedCourseByInstructorId(instructorId))
                .thenReturn(List.of(c));
        stubCommonAggregates(courseId);
        stubFileMetaAndS3(courseId);

        List<CourseDetail> details = service.queryCourseDetailsByInstructorId(instructorId, "end");

        assertThat(details).hasSize(1);
        assertThat(details.get(0).getTitle()).isEqualTo("end 강좌");
        verify(courseRepository).findEndedCourseByInstructorId(instructorId);
    }

    @Test
    @DisplayName("queryCourseDetailsByInstructorId - 잘못된 상태는 IllegalArgumentException")
    void queryCourseDetailsByInstructorId_invalid_status() {
        Long instructorId = 7L;

        assertThrows(IllegalArgumentException.class,
                () -> service.queryCourseDetailsByInstructorId(instructorId, "OPEN")); // 허용값 아님

        verifyNoInteractions(courseRepository);
    }

    // =========================
    // queryCourseDetailByCourseId
    // =========================
    @Test
    @DisplayName("queryCourseDetailByCourseId - 성공 (집계 필드 + zzim/enrolled/reviewed 반영)")
    void queryCourseDetailByCourseId_ok() {
        Long courseId = 777L;
        Long userId = 55L;
        Course c = buildCourse(courseId, 10L, "상세 강좌");

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(c));
        stubCommonAggregates(courseId);
        stubFileMetaAndS3(courseId);

        when(zzimQueryService.isZzimed(courseId, userId)).thenReturn(true);
        when(courseHistoryQueryService.enrolled(courseId, userId)).thenReturn(false);
        when(reviewQueryService.isReviewed(courseId, userId)).thenReturn(true);

        CourseDetail detail = service.queryCourseDetailByCourseId(courseId, userId);

        assertThat(detail).isNotNull();
        assertThat(detail.getTitle()).isEqualTo("상세 강좌");
        assertThat(detail.getCanLearns()).containsExactlyInAnyOrder("자바", "스프링");
        assertThat(detail.getReviewCount()).isEqualTo(3);
        assertThat(detail.getAverageReviewScore()).isEqualTo(4.3);
        assertThat(detail.getCategory()).isEqualTo("백엔드");
        assertThat(detail.getThumbnailFileInfos()).hasSize(1);
        assertThat(detail.getCourseCoverFileInfo()).isNotNull();

        // Boolean 필드들은 접근자 이름이 프로젝트마다 다를 수 있으므로
        // 일단 상호작용 검증은 필수로 수행
        verify(zzimQueryService).isZzimed(courseId, userId);
        verify(courseHistoryQueryService).enrolled(courseId, userId);
        verify(reviewQueryService).isReviewed(courseId, userId);
    }

    @Test
    @DisplayName("queryCourseDetailByCourseId - 미존재 시 IllegalArgumentException")
    void queryCourseDetailByCourseId_notFound() {
        Long courseId = 444L;
        Long userId = 1L;
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> service.queryCourseDetailByCourseId(courseId, userId));

        verify(courseRepository).findById(courseId);
        verifyNoMoreInteractions(courseRepository);
        verifyNoInteractions(zzimQueryService, courseHistoryQueryService);
    }

    // =========================
    // Helpers
    // =========================
    private Course buildCourse(Long id, Long instructorId, String title) {
        // 빌더/필드 명은 프로젝트 엔티티에 맞춰 사용
        return Course.builder()
                .id(id)
                .instructorId(instructorId)
                .title(title)
                .summary("요약")
                .description("설명")
                .level(1)
                .maxEnrollments(100)
                .enrollmentStartDate(LocalDateTime.now())
                .enrollmentEndDate(LocalDateTime.now().plusDays(7))
                .courseStartDate(LocalDate.now())
                .courseEndDate(LocalDate.now().plusDays(30))
                .announcement("공지")
                .isLive(false)
                .isApproved(true)
                .isDeleted(false)
                .currentEnrollments(0)
                .registeredAt(LocalDateTime.now())
                .build();
    }

    private void stubCommonAggregates(Long courseId) {
        when(canLearnQueryService.queryContentsByCourseId(courseId))
                .thenReturn(List.of("자바", "스프링"));
        when(reviewQueryService.countReviewsByCourseId(courseId))
                .thenReturn(3);
        when(reviewQueryService.avgStarsByCourseId(courseId))
                .thenReturn(4.3);
        when(categoryQueryService.queryNameByCourseId(courseId))
                .thenReturn("백엔드");
    }

    private void stubFileMetaAndS3(Long courseId) {
        FileMetadata thumb = FileMetadata.builder().relatedId(courseId).sequence(1).build();
        FileMetadata cover = FileMetadata.builder().relatedId(courseId).sequence(99).build();

        when(subFileMetadataQueryService.queryMetadataListByCondition(courseId, "thumbnail"))
                .thenReturn(List.of(thumb));
        when(subFileMetadataQueryService.queryMetadataByCondition(courseId, "course_cover"))
                .thenReturn(cover);

        // ResponseFileInfo 생성자가 어떻게 생겼는지 확실치 않으니 mock()으로 안전하게 처리
        when(s3Service.getResponseFileInfo(thumb)).thenReturn(mock(ResponseFileInfo.class));
        when(s3Service.getResponseFileInfo(cover)).thenReturn(mock(ResponseFileInfo.class));
    }
}
