package com.e104.reciplay.course.qna.service;


import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.entity.Question;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnaQueryServiceImpl implements QnaQueryService{
    private final QuestionRepository questionRepository;
    private final UserQueryService userQueryService;

    @Override
    public boolean isQuestioner(Long userId, Long qnaId) {
        return queryQnaById(qnaId)
                .getUserId().equals(userId);
    }

    @Override
    public boolean isAnsweredQuestion(Long qnaId) {
        return queryQnaById(qnaId)
                .getAnswerContent() != null;
    }

    @Override
    public Question queryQnaById(Long id) {
        return questionRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("존재하지 않는 QnA 입니다."));
    }

    @Override
    public List<QnaSummary> queryQnas(Long courseId, Pageable pageable) {
        return questionRepository.findQuestionSummaryWithQuestioner(courseId, pageable);
    }

    @Override
    public QnaDetail queryQnaDetail(Long qnaId) {
        return new QnaDetail(this.queryQnaById(qnaId));
    }
}
