package com.e104.reciplay.course.qna.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaSummary {
    private Long qnaId;
    private String title;
    private String questionerNicname;
    private String questionAt;
    private Boolean isAnswered;
}
