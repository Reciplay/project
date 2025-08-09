package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import com.e104.reciplay.course.qna.dto.request.QnaUpdateRequest;

public interface QnaManagementService {

    void registerNewQna(QnaRegisterRequest request, String userEmail);

    void registerAnswer(QnaAnswerRequest request, String userEmail);

    void updateQuestion(QnaUpdateRequest request, String userEmail);

    void deleteQna(Long qnaId, Long courseId, String userEmail);

    void updateAnswer(QnaAnswerRequest request, String userEmail);
}
