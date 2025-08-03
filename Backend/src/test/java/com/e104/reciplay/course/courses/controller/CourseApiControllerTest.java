package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CourseDetailQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseApiControllerTest {

    @Mock
    private CourseDetailQueryService courseDetailQueryService;

    @InjectMocks
    private CourseApiController courseApiController;

    @Test
    @DisplayName("강좌 상세 조회 - courseId로 CourseDetail 반환")
    void testGetCourseDetail() {
        // given
        Long courseId = 1L;

        CourseDetail mockDetail = CourseDetail.builder()
                .courseName("요리 클래스")
                .courseStartDate(LocalDate.of(2025, 8, 10))
                .courseEndDate(LocalDate.of(2025, 9, 1))
                .instructorId(101L)
                .enrollmentStartDate(LocalDate.of(2025, 7, 1))
                .enrollmentEndDate(LocalDate.of(2025, 8, 1))
                .category("한식")
                .reviewCount(12)
                .averageReviewScore(4.8)
                .summary("간단한 한식 배우기")
                .maxEnrollments(30)
                .isEnrollment(true)
                .description("된장찌개, 김치찌개 등 다양한 요리를 배울 수 있어요.")
                .level(2)
                .isZzim(true)
                .isLive(false)
                .announcement("첫 수업은 온라인으로 진행됩니다.")
                .isReviwed(false)
                .build();

        when(courseDetailQueryService.queryCourseDetailByCourseId(courseId)).thenReturn(mockDetail);

        // when
        ResponseEntity<ResponseRoot<CourseDetail>> response = courseApiController.getCourseDetail(courseId);

        // then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("강좌 상세 정보 조회에 성공하였습니다.");
        assertThat(response.getBody().getData().getCourseName()).isEqualTo("요리 클래스");
        assertThat(response.getBody().getData().getInstructorId()).isEqualTo(101L);
    }

    @Test
    @DisplayName("강좌 등록 요청 - 성공 응답 반환")
    void testCreateCourse() {
        // given
        CourseDetail newCourse = CourseDetail.builder()
                .courseName("신규 강좌")
                .courseStartDate(LocalDate.of(2025, 9, 1))
                .courseEndDate(LocalDate.of(2025, 10, 1))
                .instructorId(5L)
                .build();

        // when
        ResponseEntity<ResponseRoot<Object>> response = courseApiController.createCourse(newCourse);

        // then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("강좌 등록에 성공하였습니다.");
    }

    @Test
    @DisplayName("강좌 수정 요청 - 성공 응답 반환")
    void testUpdateCourse() {
        // given
        CourseDetail updated = CourseDetail.builder()
                .courseName("업데이트된 강좌명")
                .description("업데이트된 설명")
                .build();

        // when
        ResponseEntity<ResponseRoot<Object>> response = courseApiController.updateCourse(updated);

        // then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("강좌 정보 수정에 성공하였습니다.");
    }
}
