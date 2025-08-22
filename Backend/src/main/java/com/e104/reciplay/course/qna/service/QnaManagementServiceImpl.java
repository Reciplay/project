package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.exception.CourseClosedException;
import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import com.e104.reciplay.course.qna.dto.request.QnaUpdateRequest;
import com.e104.reciplay.course.qna.exception.AnswerAlreadyRegisteredException;
import com.e104.reciplay.course.qna.exception.CanNotAnswerException;
import com.e104.reciplay.course.qna.exception.EnrollmentHistoryNotFoundException;
import com.e104.reciplay.entity.Question;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnaManagementServiceImpl implements QnaManagementService{
    private final QuestionRepository questionRepository;
    private final CourseHistoryQueryService courseHistoryQueryService;
    private final UserQueryService userQueryService;
    private final CourseQueryService courseQueryService;
    private final QnaQueryService qnaQueryService;


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

    @Override
    @Transactional
    public void registerAnswer(QnaAnswerRequest request, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);
        if(!courseQueryService.isInstructorOf(user.getId(), request.getCourseId())) {
            throw new InvalidUserRoleException("오직 해당 강의의 강사만 답을 달 수 있습니다.");
        }

        Question question = qnaQueryService.queryQnaById(request.getQuestionId());

        if(question.getAnswerContent() != null) throw new CanNotAnswerException("이미 답이 존재하는 질문입니다.");

        question.setAnswerContent(request.getContent());
        question.setAnswerAt(LocalDateTime.now());
        question.setAnswerUpdatedAt(LocalDateTime.now());
    }

    @Override
    @Transactional
    public void updateQuestion(QnaUpdateRequest request, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);

        validateStudentRole(request.getQnaId(), request.getCourseId(), user.getId());

        Question question = qnaQueryService.queryQnaById(request.getQnaId());
        question.setTitle(request.getTitle());
        question.setQuestionContent(request.getQuestionContent());
        question.setQuestionUpdatedAt(LocalDateTime.now());
    }

    @Override
    public void deleteQna(Long qnaId, Long courseId, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);

        if(AuthenticationUtil.getSessionUserAuthority().equals("ROLE_STUDENT"))
            validateStudentRole(qnaId, courseId, user.getId());
        else if(AuthenticationUtil.getSessionUserAuthority().equals("ROLE_INSTRUCTOR"))
            validateInstructorRole(qnaId, courseId, user.getId());

        questionRepository.deleteById(qnaId);
    }

    @Override
    @Transactional
    public void updateAnswer(QnaAnswerRequest request, String userEmail) {
        User user = userQueryService.queryUserByEmail(userEmail);

        validateInstructorRole(request.getQuestionId(), request.getCourseId(), user.getId());
        Question question = qnaQueryService.queryQnaById(request.getQuestionId());

        question.setAnswerContent(request.getContent());
        question.setAnswerUpdatedAt(LocalDateTime.now());
    }

    // 학생용 삭제 유효성 검증
    private void validateStudentRole(Long qnaId, Long courseId, Long userId) {
        // 1. 해당 질문의 작성자여야 한다.
        // 2. 해당 강좌의 기간이 종료되지 않았어야 한다.
        // 3. 답변이 등록되지 않아야 한다.
        if(!qnaQueryService.isQuestioner(userId, qnaId)) {
            throw new EnrollmentHistoryNotFoundException("질문을 작성한 사람만 질문 수정이 가능합니다.");
        }
        if(courseQueryService.isClosedCourse(courseId)) {
            throw new CourseClosedException("이미 종료된 강좌에는 질문 변경이 불가합니다.");
        }
        if(qnaQueryService.isAnsweredQuestion(qnaId)) {
            throw new AnswerAlreadyRegisteredException("이미 답변이 달린 질문은 수정할 수 없습니다.");
        }
    }

    // 강사용 삭제 유효성 검증
    private void validateInstructorRole(Long qnaId, Long courseId, Long userId) {
        // 해당 강좌 강사만 삭제 가능하다.
        // 이미 종료된 강좌의 QnA를 조작할 순 없다.
        if(!courseQueryService.isInstructorOf(userId, courseId)) {
            throw new InvalidUserRoleException("오직 해당 강의의 강사만 할 수 있습니다.");
        }

        if(courseQueryService.isClosedCourse(courseId)) {
            throw new CourseClosedException("이미 종료된 강좌에는 QnA 변경이 불가합니다.");
        }
    }
}
