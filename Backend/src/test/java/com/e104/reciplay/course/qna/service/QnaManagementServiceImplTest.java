package com.e104.reciplay.course.qna.service;

import com.e104.reciplay.course.qna.dto.rquest.QnaRegisterRequest;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.QuestionRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

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

    @Test
    public void Qna_등록_성공() {
        User user = User.builder().email("test@mail.com").build();
        userRepository.save(user);

        Course course = Course.builder().instructorId(user.getId())
                .title("강의 1").courseEndDate(LocalDate.now().plusYears(1)).build();
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

}