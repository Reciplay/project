package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import com.e104.reciplay.course.qna.exception.CanNotAnswerException;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.entity.Question;
import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class QnaManagementServiceImplTest {
    @Autowired
    private QnaManagementService qnaManagementService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseHistoryRepository courseHistoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    private User user;

    @Test
    public void Qna_등록_성공() {
        user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrollmented(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest request = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());

        // when
        qnaManagementService.registerNewQna(request, user.getEmail());

        //
        assertThat(questionRepository.findAll()).hasSize(1);
    }

    @Test
    public void Qna_답변_등록_성공() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrollmented(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest request = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(request, user.getEmail());

        Question question = questionRepository.findAll().get(0);

        QnaAnswerRequest answerRequest = new QnaAnswerRequest(question.getId(),  course.getId(), "답변 내용");

        qnaManagementService.registerAnswer(answerRequest, user.getEmail());

        assertThat(questionRepository.findById(question.getId()).get().getAnswerContent()).isEqualTo("답변 내용");
    }

    @Test
    public void Qna_답변_등록_실패_권한없음() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        User user2 = User.builder().email("test2@mail.com").build();
        userRepository.save(user2);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user2.getId()).isEnrollmented(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest request = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(request, user2.getEmail());

        Question question = questionRepository.findAll().get(0);

        QnaAnswerRequest answerRequest = new QnaAnswerRequest(question.getId(), course.getId(), "답변 내용");

        assertThrows(InvalidUserRoleException.class, () -> {
            qnaManagementService.registerAnswer(answerRequest, user2.getEmail());
        });
    }

    @Test
    public void Qna_답변_등록_실패_이미_답변이_존재함() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrollmented(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest request = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(request, user.getEmail());

        Question question = questionRepository.findAll().get(0);
        question.setAnswerContent("이미 존재하는 답변");
        questionRepository.save(question);

        QnaAnswerRequest answerRequest = new QnaAnswerRequest(question.getId(), course.getId(), "새로운 답변 내용");

        assertThrows(CanNotAnswerException.class, () -> {
            qnaManagementService.registerAnswer(answerRequest, user.getEmail());
        });
    }

    @Test
    public void Qna_답변_등록_실패_존재하지_않는_질문() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        QnaAnswerRequest answerRequest = new QnaAnswerRequest(999L, course.getId(), "답변 내용");

        assertThrows(IllegalArgumentException.class, () -> {
            qnaManagementService.registerAnswer(answerRequest, user.getEmail());
        });
    }

    @AfterEach
    void tearDown() {
        questionRepository.deleteAllInBatch();
        courseHistoryRepository.deleteAllInBatch();
        courseRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }
}