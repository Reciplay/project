package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.request.CourseCardCondition;
import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.PagedResponse;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseCardQueryServiceImplTest {

    @Mock private CourseRepository courseRepository;
    @Mock private CanLearnQueryService canLearnQueryService;
    @Mock private ReviewQueryService reviewQueryService;
    @Mock private CategoryQueryService categoryQueryService;
    @Mock private SubFileMetadataQueryService subFileMetadataQueryService;
    @Mock private CourseHistoryQueryService courseHistoryQueryService;
    @Mock private S3Service s3Service;
    @Mock private InstructorQueryService instructorQueryService;

    @InjectMocks
    private CourseCardQueryServiceImpl service;

    private static final Pageable PAGEABLE = PageRequest.of(0, 10, Sort.by(Sort.Order.desc("courseStartDate")));

    // ---------- 공통 헬퍼 ----------

    private Course buildCourse(Long id, Long instructorId, String title) {
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

    private void stubCommon(Long courseId, Long instructorId, String instructorName,
                            List<String> canLearns, double avg, boolean enrolled,
                            String categoryName, String fileType) {

        when(instructorQueryService.queryNameByInstructorId(instructorId)).thenReturn(instructorName);
        when(categoryQueryService.queryNameByCourseId(courseId)).thenReturn(categoryName);
        when(canLearnQueryService.queryContentsByCourseId(courseId)).thenReturn(canLearns);
        when(reviewQueryService.avgStarsByCourseId(courseId)).thenReturn(avg);
        when(courseHistoryQueryService.enrolled(anyLong(), eq(courseId))).thenReturn(enrolled);

        FileMetadata meta = FileMetadata.builder().relatedId(courseId).build();
        when(subFileMetadataQueryService.queryMetadataByCondition(courseId, fileType)).thenReturn(meta);
        when(s3Service.getResponseFileInfo(meta)).thenReturn(mock(ResponseFileInfo.class));
    }

    // ---------- 테스트 ----------

    @Test
    @DisplayName("requestCategory == null 이면 IllegalArgumentException")
    void queryCardsByCardCondtion_null_category_throws() {
        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory(null)
                .build();

        assertThrows(IllegalArgumentException.class,
                () -> service.queryCardsByCardCondtion(cond, PAGEABLE, 1L));

        verifyNoInteractions(courseRepository);
    }

    @Test
    @DisplayName("special: findSpecialCoursesPage 호출 + course_cover 사용 + 필드 매핑 검증")
    void special_ok() {
        Long userId = 10L;
        Course c = buildCourse(1L, 77L, "스페셜");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findSpecialCoursesPage(PAGEABLE)).thenReturn(page);

        stubCommon(1L, 77L, "홍길동",
                List.of("자바", "스프링"), 4.9, true, "백엔드", "COURSE_COVER");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("special")
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        // 레포 호출
        verify(courseRepository).findSpecialCoursesPage(PAGEABLE);

        // 결과 검증
        assertThat(resp.getContent()).hasSize(1);
        CourseCard card = resp.getContent().get(0);
        assertThat(card.getCourseId()).isEqualTo(1L);
        assertThat(card.getInstructorId()).isEqualTo(77L);
        assertThat(card.getInstructorName()).isEqualTo("홍길동");
        assertThat(card.getCategory()).isEqualTo("백엔드");
        assertThat(card.getCanLearns()).containsExactlyInAnyOrder("자바", "스프링");
        assertThat(card.getAverageReviewScore()).isEqualTo(4.9);
        assertThat(card.getIsEnrolled()).isTrue();
        assertThat(card.getResponseFileInfo()).isNotNull();

        // 파일 타입 확인
        verify(subFileMetadataQueryService).queryMetadataByCondition(1L, "COURSE_COVER");
    }

    @Test
    @DisplayName("soon: findSoonCoursesPage 호출 + thumbnail 사용 + 필드 매핑 검증")
    void soon_ok() {
        Long userId = 20L;
        Course c = buildCourse(2L, 88L, "모집중");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findSoonCoursesPage(PAGEABLE)).thenReturn(page);

        stubCommon(2L, 88L, "이몽룡",
                List.of("JS", "React"), 4.2, false, "프론트엔드", "THUMBNAIL");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("soon")
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        verify(courseRepository).findSoonCoursesPage(PAGEABLE);

        assertThat(resp.getContent()).hasSize(1);
        CourseCard card = resp.getContent().get(0);
        assertThat(card.getCourseId()).isEqualTo(2L);
        assertThat(card.getInstructorId()).isEqualTo(88L);
        assertThat(card.getInstructorName()).isEqualTo("이몽룡");
        assertThat(card.getCategory()).isEqualTo("프론트엔드");
        assertThat(card.getCanLearns()).containsExactlyInAnyOrder("JS", "React");
        assertThat(card.getAverageReviewScore()).isEqualTo(4.2);
        assertThat(card.getIsEnrolled()).isFalse();
        assertThat(card.getResponseFileInfo()).isNotNull();

        verify(subFileMetadataQueryService).queryMetadataByCondition(2L, "THUMBNAIL");
    }

    @Test
    @DisplayName("search: findsearchCoursesPage 호출(검색어/수강여부 전달) + thumbnail 사용")
    void search_ok() {
        Long userId = 30L;
        Course c = buildCourse(3L, 99L, "검색강좌");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findsearchCoursesPage(eq("java"), eq(Boolean.TRUE), eq(userId), eq(PAGEABLE)))
                .thenReturn(page);

        stubCommon(3L, 99L, "성춘향",
                List.of("자료구조"), 3.8, true, "CS", "THUMBNAIL");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("search")
                .searchContent("java")
                .isEnrolled(true)
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        verify(courseRepository).findsearchCoursesPage("java", true, userId, PAGEABLE);
        assertThat(resp.getContent()).hasSize(1);
        verify(subFileMetadataQueryService).queryMetadataByCondition(3L, "THUMBNAIL");
    }

    @Test
    @DisplayName("instructor: findInstructorCoursesPage 호출 + thumbnail 사용")
    void instructor_ok() {
        Long userId = 40L;
        Long instructorId = 555L;
        Course c = buildCourse(4L, instructorId, "강사강좌");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findInstructorCoursesPage(eq(instructorId), eq(PAGEABLE))).thenReturn(page);

        stubCommon(4L, instructorId, "교수님",
                List.of("알고리즘"), 4.0, false, "컴퓨터", "THUMBNAIL");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("instructor")
                .instructorId(instructorId)
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        verify(courseRepository).findInstructorCoursesPage(instructorId, PAGEABLE);
        assertThat(resp.getContent()).hasSize(1);
        verify(subFileMetadataQueryService).queryMetadataByCondition(4L, "THUMBNAIL");
    }

    @Test
    @DisplayName("enrolled: findEnrolledCoursesPage 호출 + thumbnail 사용")
    void enrolled_ok() {
        Long userId = 50L;
        Course c = buildCourse(5L, 1L, "내 수강중");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findEnrolledCoursesPage(eq(userId), eq(PAGEABLE))).thenReturn(page);

        stubCommon(5L, 1L, "강사", List.of("SQL"), 4.1, true, "DB", "THUMBNAIL");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("enrolled")
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        verify(courseRepository).findEnrolledCoursesPage(userId, PAGEABLE);
        assertThat(resp.getContent()).hasSize(1);
        assertThat(resp.getContent().get(0).getIsEnrolled()).isTrue();
    }

    @Test
    @DisplayName("zzim: findZzimCoursesPage 호출 + thumbnail 사용")
    void zzim_ok() {
        Long userId = 60L;
        Course c = buildCourse(6L, 2L, "찜한 강좌");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findZzimCoursesPage(eq(userId), eq(PAGEABLE))).thenReturn(page);

        stubCommon(6L, 2L, "강사", List.of("HTTP"), 3.9, false, "네트워크", "THUMBNAIL");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("zzim")
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        verify(courseRepository).findZzimCoursesPage(userId, PAGEABLE);
        assertThat(resp.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("complete: findCompletedCoursesPage 호출 + thumbnail 사용")
    void complete_ok() {
        Long userId = 70L;
        Course c = buildCourse(7L, 3L, "완료 강좌");
        Page<Course> page = new PageImpl<>(List.of(c), PAGEABLE, 1);
        when(courseRepository.findCompletedCoursesPage(eq(userId), eq(PAGEABLE))).thenReturn(page);

        stubCommon(7L, 3L, "강사", List.of("테스트"), 4.6, false, "QA", "THUMBNAIL");

        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("complete")
                .build();

        PagedResponse<CourseCard> resp = service.queryCardsByCardCondtion(cond, PAGEABLE, userId);

        verify(courseRepository).findCompletedCoursesPage(userId, PAGEABLE);
        assertThat(resp.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("지원하지 않는 requestCategory면 IllegalArgumentException")
    void unsupported_category_throws() {
        CourseCardCondition cond = CourseCardCondition.builder()
                .requestCategory("unknown")
                .build();

        assertThrows(IllegalArgumentException.class,
                () -> service.queryCardsByCardCondtion(cond, PAGEABLE, 1L));

        verifyNoInteractions(courseRepository);
    }
}
