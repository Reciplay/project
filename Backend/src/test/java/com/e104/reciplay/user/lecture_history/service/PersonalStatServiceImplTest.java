package com.e104.reciplay.user.lecture_history.service;

import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.LectureHistory;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.LectureHistoryRepository;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class PersonalStatServiceImplTest {

    @Autowired
    private PersonalStatService personalStatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private LectureHistoryRepository lectureHistoryRepository;

    private User testUser;
    private Course testCourse;
    private List<Lecture> testLectures = new ArrayList<>();

    @BeforeEach
    void setUp() {
        // 테스트 데이터 정리
        lectureHistoryRepository.deleteAll();
        lectureRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // 테스트 유저 생성
        testUser = User.builder().isActivated(true)
                .nickname("testUser")
                .email("test@example.com")
                .password("password")
                .build();
        userRepository.save(testUser);

        // 테스트 강좌 생성
        testCourse = Course.builder()
                .title("Test Course")
                .instructorId(1L)
                .build();
        courseRepository.save(testCourse);

        // 테스트 강의 5개 생성
        for (int i = 1; i <= 5; i++) {
            Lecture lecture = Lecture.builder()
                    .courseId(testCourse.getId())
                    .title("Test Lecture " + i)
                    .sequence(i)
                    .build();
            testLectures.add(lecture);
        }
        lectureRepository.saveAll(testLectures);
    }

    @AfterEach
    void tearDown() {
        // 테스트 데이터 정리
        lectureHistoryRepository.deleteAll();
        lectureRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("수강률 계산 테스트 - 3개 수강 시 60% 진행률")
    void calcCourseProgress_Success() {
        // given
        // 5개의 강의 중 3개에 대한 수강 기록 생성
        for (int i = 0; i < 3; i++) {
            LectureHistory history = LectureHistory.builder()
                    .userId(testUser.getId())
                    .lectureId(testLectures.get(i).getId())
                    .build();
            lectureHistoryRepository.save(history);
        }

        // when
        Double progress = personalStatService.calcCourseProgress(testCourse.getId(), testUser.getEmail());

        // then
        assertThat(progress).isEqualTo(0.6); // 3/5 = 0.6
    }

    @Test
    @DisplayName("수강률 계산 실패 테스트 - 강좌에 강의가 없을 경우")
    void calcCourseProgress_Fail_NoLectures() {
        // given
        // 강의가 없는 새로운 강좌 생성
        Course courseWithNoLectures = Course.builder()
                .title("Empty Course")
                .instructorId(1L)
                .build();
        courseRepository.save(courseWithNoLectures);

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            personalStatService.calcCourseProgress(courseWithNoLectures.getId(), testUser.getEmail());
        });
        assertThat(exception.getMessage()).isEqualTo("강좌에 강의가 존재하지 않습니다.");
    }

    @Test
    @DisplayName("수강률 계산 테스트 - 수강 기록이 없을 경우 0% 진행률")
    void calcCourseProgress_NoHistory() {
        // when
        Double progress = personalStatService.calcCourseProgress(testCourse.getId(), testUser.getEmail());

        // then
        assertThat(progress).isEqualTo(0.0);
    }
}
