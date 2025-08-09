package com.e104.reciplay.course.qna.dto.response;

import com.e104.reciplay.entity.Question;
import com.querydsl.core.annotations.QueryProjection;
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

    @QueryProjection
    public QnaSummary(Question question, String userNickname) {
        this.qnaId = question.getId();
        this.title = question.getTitle();
        this.questionAt = question.getQuestionAt();
        this.isAnswered = (question.getAnswerContent() != null);
        this.questionerNicname = userNickname;
    }
}
