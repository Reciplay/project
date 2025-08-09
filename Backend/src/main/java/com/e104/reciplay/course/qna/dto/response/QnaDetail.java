package com.e104.reciplay.course.qna.dto.response;

import com.e104.reciplay.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaDetail {
    private String title;
    private String questionContent;
    private String answerContent;
    private LocalDateTime answerAt;
    private LocalDateTime questionUpdateAt;
    private LocalDateTime answerUpdateAt;

    public QnaDetail(Question question) {
        this.title = question.getTitle();
        this.questionContent = question.getQuestionContent();
        this.answerContent = question.getAnswerContent();
        this.answerAt = question.getAnswerAt();
        this.answerUpdateAt = question.getAnswerUpdatedAt();
        this.questionUpdateAt = question.getQuestionUpdatedAt();
    }
}
