package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;

public interface QnaManagementService {

    void registerNewQna(QnaRegisterRequest request, String userEmail);

    void registerAnswer(QnaAnswerRequest request, String userEmail);
}
