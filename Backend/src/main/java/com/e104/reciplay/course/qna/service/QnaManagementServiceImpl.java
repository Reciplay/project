package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.rquest.QnaRegisterRequest;
import com.e104.reciplay.course.qna.exception.EnrollmentHistoryNotFoundException;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnaManagementServiceImpl implements QnaManagementService{
    private final QuestionRepository questionRepository;
    private final CourseHistoryQueryService courseHistoryQueryService;
    private final UserQueryService userQueryService;

    @Override
    public void registerNewQna(QnaRegisterRequest request, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);
        if(!courseHistoryQueryService.enrolled(user.getId(), request.getCourseId())) {
            throw new EnrollmentHistoryNotFoundException()
        }
    }
}
