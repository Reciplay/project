package com.e104.reciplay.course.qna.dto.rquest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaRegisterRequest {
    private String title;
    private String questionContent;
    private Long courseId;
}
