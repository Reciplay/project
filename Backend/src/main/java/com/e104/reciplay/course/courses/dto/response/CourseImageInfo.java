package com.e104.reciplay.course.courses.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseImageInfo {
    private String courseImageUrl;
    private Integer sequence;
}
