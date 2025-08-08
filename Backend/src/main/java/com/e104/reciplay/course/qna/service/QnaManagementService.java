package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.rquest.QnaRegisterRequest;

public interface QnaManagementService {

    void registerNewQna(QnaRegisterRequest request, String userEmail);
}
