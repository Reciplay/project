package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdCourseDetail;
import com.e104.reciplay.admin.dto.response.AdCourseSummary;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.entity.Category;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.user.profile.service.CategoryQueryService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdCourseQueryServiceImplTest {

    @Mock CourseRepository courseRepository;
    @Mock CategoryQueryService categoryQueryService;
    @Mock CanLearnQueryService canLearnQueryService;
    @Mock InstructorQueryService instructorQueryService;
    @Mock LectureQueryService lectureQueryService;

    @InjectMocks
    AdCourseQueryServiceImpl service;

    @Nested
    @DisplayName("queryAdCourseSummary")
    class QueryAdCourseSummaryTests {

        @Test
        @DisplayName("isApprove == null 이면 IllegalArgumentException")
        void nullIsApproveThrows() {
            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> service.queryAdCourseSummary(null));
            assertTrue(ex.getMessage().contains("isApprove"));
            verifyNoInteractions(courseRepository);
        }

        @Test
        @DisplayName("정상 플로우: repo 위임 및 결과 반환")
        void delegateToRepository() {
            List<AdCourseSummary> expected = List.of(
                    mock(AdCourseSummary.class), mock(AdCourseSummary.class)
            );
            given(courseRepository.findAdCourseSummariesByIsApprove(true))
                    .willReturn(expected);

            List<AdCourseSummary> actual = service.queryAdCourseSummary(true);

            assertSame(expected, actual);
            verify(courseRepository, times(1)).findAdCourseSummariesByIsApprove(true);
        }
    }

    @Nested
    @DisplayName("queryCourseDetail")
    class QueryCourseDetailTests {

        @Test
        @DisplayName("코스 미존재 시 EntityNotFoundException")
        void courseNotFoundThrows() {
            given(courseRepository.findById(999L)).willReturn(Optional.empty());

            assertThrows(EntityNotFoundException.class,
                    () -> service.queryCourseDetail(999L));

            verify(courseRepository, times(1)).findById(999L);
            verifyNoInteractions(canLearnQueryService, categoryQueryService, instructorQueryService, lectureQueryService);
        }

        @Test
        @DisplayName("정상 플로우: 연관 데이터 조회 및 AdCourseDetail 필드 세팅 (Category 엔티티 사용)")
        void successPopulatesDetail() {
            // given
            long courseId = 10L;
            long categoryId = 3L;
            long instructorId = 5L;

            Course course = mock(Course.class, Answers.RETURNS_DEEP_STUBS);
            given(course.getId()).willReturn(courseId);
            given(course.getCategoryId()).willReturn(categoryId);
            given(course.getInstructorId()).willReturn(instructorId);
            given(courseRepository.findById(courseId)).willReturn(Optional.of(course));

            List<String> canLearns = List.of("스프링 빈 이해", "AOP 기본");
            given(canLearnQueryService.queryContentsByCourseId(courseId)).willReturn(canLearns);

            LectureDetail ld1 = mock(LectureDetail.class);
            LectureDetail ld2 = mock(LectureDetail.class);
            List<LectureDetail> lectureDetails = List.of(ld1, ld2);
            given(lectureQueryService.queryLectureDetails(courseId)).willReturn(lectureDetails);

            // Category 엔티티 모킹
            Category category = Category.builder()
                    .id(categoryId)
                    .name("백엔드")
                    .build();
            given(categoryQueryService.queryCategoryById(categoryId)).willReturn(category);

            // Instructor 이름
            given(instructorQueryService.queryNameByInstructorId(instructorId)).willReturn("홍길동");

            // when
            AdCourseDetail detail = service.queryCourseDetail(courseId);

            // then
            assertNotNull(detail);
            assertEquals(lectureDetails, detail.getLectureDetails());
            assertEquals("백엔드", detail.getCategory());
            assertEquals("홍길동", detail.getInstructorName());
            assertEquals(canLearns, detail.getCanLearns());

            verify(courseRepository, times(1)).findById(courseId);
            verify(canLearnQueryService, times(1)).queryContentsByCourseId(courseId);
            verify(lectureQueryService, times(1)).queryLectureDetails(courseId);
            verify(categoryQueryService, times(1)).queryCategoryById(categoryId);
            verify(instructorQueryService, times(1)).queryNameByInstructorId(instructorId);
            verifyNoMoreInteractions(courseRepository, canLearnQueryService, lectureQueryService,
                    categoryQueryService, instructorQueryService);
        }
    }
}
