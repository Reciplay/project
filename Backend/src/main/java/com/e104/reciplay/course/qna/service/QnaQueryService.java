package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.entity.Question;

public interface QnaQueryService {
    boolean isQuestioner(Long userId, Long qnaId);
    boolean isAnsweredQuestion(Long qnaId);

    Question queryQnaById(Long id);
}
