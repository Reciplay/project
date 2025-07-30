package com.e104.reciplay.course.courses.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseCardCondition {
    private String requestCategory; // 요청을 구분한기 위한 카테고리
    private String searchContent; // 검색 문자열
    private Long instructorId; // 강사 Id
    private Boolean isEnrollment; // 필터링(수강 여부)
}
