package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CourseDetailQueryServiceImplTest {

    private final CourseDetailQueryServiceImpl service = new CourseDetailQueryServiceImpl();

    @Test
    @DisplayName("courseId를 전달하면 null을 반환한다 (임시 구현)")
    void queryCourseDetail_returnsNull() {
        // given
        Long courseId = 1L;

        // when
        CourseDetail result = service.queryCourseDetailByCourseId(courseId);

        // then
        assertThat(result).isNull();
    }
}
