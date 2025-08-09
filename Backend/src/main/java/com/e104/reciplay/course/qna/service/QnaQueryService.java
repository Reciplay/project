package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.entity.Question;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QnaQueryService {
    boolean isQuestioner(Long userId, Long qnaId);
    boolean isAnsweredQuestion(Long qnaId);
    Question queryQnaById(Long id);
    List<QnaSummary> queryQnas(Long courseId, Pageable pageable);
    QnaDetail queryQnaDetail(Long qnaId);
}
