package com.e104.reciplay.course.courses.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestCourseInfo {
    private Long courseId; // 강좌 정보 수정을 위함

    private String title;
    private LocalDateTime enrollmentStartDate;
    private LocalDateTime enrollmentEndDate;
    private Long categoryId;
    private String summary;
    private Integer maxEnrollments;
    private String description;
    private Integer level;
    private String announcement;
    private List<String> canLearns; //이런걸 배울 수 있어요

}

/*
{
  "title": "파스타 마스터 클래스",
  "enrollmentStartDate": "2025-08-13T10:00:00",
  "enrollmentEndDate": "2025-08-20T23:59:59",
  "categoryId": 3,
  "summary": "기초부터 소스까지 한 번에",
  "maxEnrollments": 50,
  "description": "상세 소개...",
  "level": 50,
  "announcement": "개강 전 공지 예정",
  "canLearns": ["면 반죽", "기본 소스", "플레이팅"]
}

 */