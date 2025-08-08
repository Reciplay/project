package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.courses.exception.CourseClosedException;
import com.e104.reciplay.course.qna.dto.rquest.QnaRegisterRequest;
import com.e104.reciplay.course.qna.exception.EnrollmentHistoryNotFoundException;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Question;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
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
    private final CourseQueryService courseQueryService;

    @Override
    @Transactional
    public void registerNewQna(QnaRegisterRequest request, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);
        if(!courseHistoryQueryService.enrolled(user.getId(), request.getCourseId())) {
            throw new EnrollmentHistoryNotFoundException("수강 신청한 사람만 질문 등록이 가능합니다.");
        }
        if(courseQueryService.isClosedCourse(request.getCourseId())) {
            throw new CourseClosedException("이미 종료된 강좌에는 질문 등록이 불가합니다.");
        }

        Question question = new Question(request, user.getId());
        questionRepository.save(question);
    }
}
