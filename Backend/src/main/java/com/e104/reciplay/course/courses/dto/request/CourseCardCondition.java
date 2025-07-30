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
    private Boolean isEnrollment; // 검색 필터링(수강 여부)
    private String courseStatus; // 강좌 상태(강사 강좌 관리 페이지에서의 모집중/진행중/종료)
}
