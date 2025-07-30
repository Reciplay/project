package com.e104.reciplay.course.qna.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaSummary {
    private Long qnaId;
    private String title;
    private String questionerNicname;
    private LocalDateTime questionAt;
    private Boolean isAnswered;
}
