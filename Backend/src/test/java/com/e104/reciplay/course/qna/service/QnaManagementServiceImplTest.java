package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.exception.CourseClosedException;
import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import com.e104.reciplay.course.qna.dto.request.QnaUpdateRequest;
import com.e104.reciplay.course.qna.exception.AnswerAlreadyRegisteredException;
import com.e104.reciplay.course.qna.exception.CanNotAnswerException;
import com.e104.reciplay.course.qna.exception.EnrollmentHistoryNotFoundException;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.entity.Question;
import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    private MockedStatic<AuthenticationUtil> authenticationUtilMockedStatic;

    @BeforeEach
    void setUp() {
        authenticationUtilMockedStatic = Mockito.mockStatic(AuthenticationUtil.class);
    }

    @Test
    public void Qna_등록_성공() {
        user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
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
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
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
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user2.getId()).isEnrolled(true).build();
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
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
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
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        QnaAnswerRequest answerRequest = new QnaAnswerRequest(999L, course.getId(), "답변 내용");

        assertThrows(IllegalArgumentException.class, () -> {
            qnaManagementService.registerAnswer(answerRequest, user.getEmail());
        });
    }

    @Test
    public void Qna_수정_성공() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest registerRequest = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(registerRequest, user.getEmail());
        Question question = questionRepository.findAll().get(0);

        QnaUpdateRequest updateRequest = new QnaUpdateRequest(course.getId(), question.getId(), "질문 1", "수정된 질문 내용");
        qnaManagementService.updateQuestion(updateRequest, user.getEmail());

        Question updatedQuestion = questionRepository.findById(question.getId()).get();
        assertThat(updatedQuestion.getQuestionContent()).isEqualTo("수정된 질문 내용");
        assertThat(updatedQuestion.getQuestionUpdatedAt()).isNotNull();
    }

    @Test
    public void Qna_수정_실패_질문_작성자가_아님() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);
        User otherUser = User.builder().email("other@mail.com").build();
        userRepository.save(otherUser);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest registerRequest = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(registerRequest, user.getEmail());
        Question question = questionRepository.findAll().get(0);

        QnaUpdateRequest updateRequest = new QnaUpdateRequest(course.getId(), question.getId(), "질문 1", "수정된 질문 내용");

        assertThrows(EnrollmentHistoryNotFoundException.class, () -> {
            qnaManagementService.updateQuestion(updateRequest, otherUser.getEmail());
        });
    }

    @Test
    public void Qna_수정_실패_종료된_강좌() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId()).isApproved(true)
                .title("강의 1").courseEndDate(LocalDate.now().minusDays(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(2)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
        courseHistoryRepository.save(history);

        Question question = questionRepository.save(Question.builder().title("질문 1").userId(user.getId()).questionContent("질문 내용").courseId(course.getId()).build());

        QnaUpdateRequest updateRequest = new QnaUpdateRequest(course.getId(), question.getId(), "질문 1", "수정된 질문 내용");

        assertThrows(CourseClosedException.class, () -> {
            qnaManagementService.updateQuestion(updateRequest, user.getEmail());
        });
    }

    @Test
    public void Qna_수정_실패_이미_답변이_달린_질문() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(user.getId()).isEnrolled(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest registerRequest = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(registerRequest, user.getEmail());
        Question question = questionRepository.findAll().get(0);
        question.setAnswerContent("답변 내용");
        question.setAnswerAt(LocalDateTime.now());
        questionRepository.save(question);

        QnaUpdateRequest updateRequest = new QnaUpdateRequest(course.getId(), question.getId(), "질문 1", "수정된 질문 내용");

        assertThrows(AnswerAlreadyRegisteredException.class, () -> {
            qnaManagementService.updateQuestion(updateRequest, user.getEmail());
        });
    }

    @Test
    public void Qna_삭제_성공_학생() {
        User student = User.builder().email("student@mail.com").build();
        userRepository.save(student);

        Course course = Course.builder().instructorId(123L)
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).isApproved(true)
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        CourseHistory history = CourseHistory.builder()
                .courseId(course.getId()).userId(student.getId()).isEnrolled(true).build();
        courseHistoryRepository.save(history);

        QnaRegisterRequest registerRequest = new QnaRegisterRequest("질문 1", "질문 내용", course.getId());
        qnaManagementService.registerNewQna(registerRequest, student.getEmail());
        Question question = questionRepository.findAll().get(0);

        authenticationUtilMockedStatic.when(AuthenticationUtil::getSessionUserAuthority).thenReturn("ROLE_STUDENT");

        qnaManagementService.deleteQna(question.getId(), course.getId(), student.getEmail());

        assertThat(questionRepository.findById(question.getId())).isEmpty();
    }

    @Test
    public void Qna_삭제_성공_강사() {
        User instructor = User.builder().email("instructor@mail.com").build();
        userRepository.save(instructor);

        Course course = Course.builder().instructorId(instructor.getId()).isApproved(true)
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        Question question = questionRepository.save(Question.builder().title("질문 1").questionContent("질문 내용").courseId(course.getId()).build());

        authenticationUtilMockedStatic.when(AuthenticationUtil::getSessionUserAuthority).thenReturn("ROLE_INSTRUCTOR");

        qnaManagementService.deleteQna(question.getId(), course.getId(), instructor.getEmail());

        assertThat(questionRepository.findById(question.getId())).isEmpty();
    }

    @Test
    public void Qna_답변_수정_성공() {
        User instructor = User.builder().email("instructor@mail.com").build();
        userRepository.save(instructor);

        Course course = Course.builder().instructorId(instructor.getId()).isApproved(true)
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        Question question = questionRepository.save(Question.builder().title("질문 1").questionContent("질문 내용").courseId(course.getId()).build());

        QnaAnswerRequest answerRequest = new QnaAnswerRequest(question.getId(), course.getId(), "최초 답변");
        qnaManagementService.registerAnswer(answerRequest, instructor.getEmail());

        QnaAnswerRequest updateAnswerRequest = new QnaAnswerRequest(question.getId(), course.getId(), "수정된 답변");
        qnaManagementService.updateAnswer(updateAnswerRequest, instructor.getEmail());

        Question updatedQuestion = questionRepository.findById(question.getId()).get();
        assertThat(updatedQuestion.getAnswerContent()).isEqualTo("수정된 답변");
    }

    @AfterEach
    void tearDown() {
        authenticationUtilMockedStatic.close();
        questionRepository.deleteAllInBatch();
        courseHistoryRepository.deleteAllInBatch();
        courseRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }
}
