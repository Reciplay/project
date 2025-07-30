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

public class QnaDetail {
    private String title;
    private String questionerNickname;
    private String questionContent;
    private String answerContent;
    private LocalDateTime questionAt;
    private LocalDateTime answerAt;
    private LocalDateTime questionUpdatedAt;
    private LocalDateTime answerUpdatedAt;
    private Boolean isQuestioner; // 해당 질문의 작성자인지
    private Boolean isAutor; // 해당 강좌의 강사인지
}
