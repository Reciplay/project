package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Question;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.Disabled;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class QnaQueryServiceImplTest {

    @Autowired
    private QnaQueryService qnaQueryService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User user, user2;
    private Course course;
    private Question question, answeredQuestion;

    @BeforeEach
    void setUp() {
        user = User.builder().email("test@mail.com").nickname("testUser").isActivated(true).build();
        user2 = User.builder().email("test2@mail.com").nickname("testUser2").isActivated(true).build();
        userRepository.saveAll(List.of(user, user2));

        course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1))
                .courseStartDate(LocalDate.now().minusDays(1)).build();
        courseRepository.save(course);

        question = Question.builder().userId(user.getId()).courseId(course.getId()).title("질문").questionContent("내용").build();
        answeredQuestion = Question.builder().userId(user2.getId()).courseId(course.getId()).title("답변된 질문").questionContent("내용2").answerContent("답변").build();
        questionRepository.saveAll(List.of(question, answeredQuestion));
    }

    @AfterEach
    void tearDown() {
        questionRepository.deleteAllInBatch();
        courseRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }

    @Test
    void isQuestioner_True_False() {
        assertTrue(qnaQueryService.isQuestioner(user.getId(), question.getId()));
        assertFalse(qnaQueryService.isQuestioner(user2.getId(), question.getId()));
    }

    @Test
    void isAnsweredQuestion_True_False() {
        assertTrue(qnaQueryService.isAnsweredQuestion(answeredQuestion.getId()));
        assertFalse(qnaQueryService.isAnsweredQuestion(question.getId()));
    }

    @Test
    void queryQnaById_성공() {
        Question foundQuestion = qnaQueryService.queryQnaById(question.getId());
        assertThat(foundQuestion.getId()).isEqualTo(question.getId());
    }

    @Test
    void queryQnaById_실패_존재하지않는QnA() {
        assertThrows(IllegalArgumentException.class, () -> {
            qnaQueryService.queryQnaById(999L);
        });
    }

    @Test
    void queryQnas_성공() {
        Pageable pageable = PageRequest.of(0, 10);
        List<QnaSummary> qnaSummaries = qnaQueryService.queryQnas(course.getId(), pageable);
        assertThat(qnaSummaries).hasSize(2);
        assertThat(qnaSummaries.get(0).getTitle()).isEqualTo(answeredQuestion.getTitle()); // 최신순 정렬 확인
        assertThat(qnaSummaries.get(1).getTitle()).isEqualTo(question.getTitle());
    }

    @Test
    void queryQnaDetail_성공() {
        QnaDetail qnaDetail = qnaQueryService.queryQnaDetail(question.getId());
        assertThat(qnaDetail.getTitle()).isEqualTo(question.getTitle());
        assertThat(qnaDetail.getQuestionContent()).isEqualTo(question.getQuestionContent());
    }

    @AfterEach
    void cleanUp() {
        questionRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();
    }
}
