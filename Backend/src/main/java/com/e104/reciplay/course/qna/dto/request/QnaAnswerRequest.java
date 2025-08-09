package com.e104.reciplay.course.qna.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaAnswerRequest {
    private Long questionId;
    private Long courseId;
    private String content;
}
