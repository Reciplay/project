package com.e104.reciplay.course.qna.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaUpdateRequest {
    private Long courseId;
    private Long qnaId;
    private String title;
    private String questionContent;
}
