package com.e104.reciplay.course.enrollment.service;

import com.e104.reciplay.course.enrollment.exception.AlreadyEnrolledException;
import com.e104.reciplay.course.enrollment.exception.EnrollmentFailureException;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class EnrollmentManagementServiceImplTest {

    @Autowired
    private EnrollmentManagementService enrollmentManagementService;

    @Autowired
    private CourseHistoryRepository courseHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User testUser;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("test@test.com")
                .password("password")
                .nickname("testUser")
                .build();
        userRepository.save(testUser);

        testCourse = new Course();
        testCourse.setEnrollmentStartDate(LocalDateTime.now().minusDays(1));
        testCourse.setEnrollmentEndDate(LocalDateTime.now().plusDays(1));
        testCourse.setMaxEnrollments(10);
        courseRepository.save(testCourse);
    }

    @AfterEach
    void tearDown() {
        courseHistoryRepository.deleteAll();
        userRepository.deleteAll();
        courseRepository.deleteAll();
    }

    @Test
    @DisplayName("enroll - success")
    void enroll() {
        // when
        enrollmentManagementService.enroll(testCourse.getId(), testUser.getEmail());

        // then
        CourseHistory courseHistory = courseHistoryRepository.findByCourseIdAndUserId(testCourse.getId(), testUser.getId()).orElse(null);
        assertThat(courseHistory).isNotNull();
        assertThat(courseHistory.getCourseId()).isEqualTo(testCourse.getId());
        assertThat(courseHistory.getUserId()).isEqualTo(testUser.getId());
    }

    @Test
    @DisplayName("enroll - already enrolled")
    void enroll_alreadyEnrolled() {
        // given
        courseHistoryRepository.save(new CourseHistory(null, testUser.getId(), testCourse.getId(), null, true));

        // when & then
        assertThrows(AlreadyEnrolledException.class,
                () -> enrollmentManagementService.enroll(testCourse.getId(), testUser.getEmail()));
    }

    @Test
    @DisplayName("cancle - success")
    void cancle() {
        // given
        courseHistoryRepository.save(new CourseHistory(null, testUser.getId(), testCourse.getId(), null, true));

        // when
        enrollmentManagementService.cancle(testCourse.getId(), testUser.getEmail());

        // then
        CourseHistory courseHistory = courseHistoryRepository.findByCourseIdAndUserId(testCourse.getId(), testUser.getId()).orElse(null);
        assertThat(courseHistory).isNull();
    }

    @Test
    @DisplayName("cancle - not enrolled")
    void cancle_notEnrolled() {
        // when & then
        assertThrows(EnrollmentFailureException.class,
                () -> enrollmentManagementService.cancle(testCourse.getId(), testUser.getEmail()));
    }
}
