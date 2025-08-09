package com.e104.reciplay.course.qna.service;


import com.e104.reciplay.entity.Question;
import com.e104.reciplay.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnaQueryServiceImpl implements QnaQueryService{
    private final QuestionRepository questionRepository;

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
}
