package com.e104.reciplay.user.zzim.service;

import com.e104.reciplay.course.courses.repository.ZzimRepository;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Zzim;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class ZzimManagementServiceImplTest {

    @Autowired
    private ZzimManagementService zzimManagementService;

    @Autowired
    private ZzimRepository zzimRepository;

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
                .isActivated(true)
                .build();
        userRepository.save(testUser);

        testCourse = new Course();
        courseRepository.save(testCourse);
    }

    @AfterEach
    void tearDown() {
        zzimRepository.deleteAll();
        userRepository.deleteAll();
        courseRepository.deleteAll();
    }

    @Test
    @DisplayName("zzimCourse - success")
    void zzimCourse() {
        // when
        zzimManagementService.zzimCourse(testCourse.getId(), testUser.getEmail());

        // then
        Zzim zzim = zzimRepository.findByCourseIdAndUserId(testCourse.getId(), testUser.getId()).orElse(null);
        assertThat(zzim).isNotNull();
        assertThat(zzim.getCourseId()).isEqualTo(testCourse.getId());
        assertThat(zzim.getUserId()).isEqualTo(testUser.getId());
    }

    @Test
    @DisplayName("zzimCourse - already zzimed")
    void zzimCourse_alreadyZzimed() {
        // given
        zzimRepository.save(new Zzim(null, testUser.getId(), testCourse.getId()));

        // when & then
        assertThrows(IllegalArgumentException.class,
                () -> zzimManagementService.zzimCourse(testCourse.getId(), testUser.getEmail()));
    }

    @Test
    @DisplayName("unzzimCourse - success")
    void unzzimCourse() {
        // given
        zzimRepository.save(new Zzim(null, testUser.getId(), testCourse.getId()));

        // when
        zzimManagementService.unzzimCourse(testCourse.getId(), testUser.getEmail());

        // then
        Zzim zzim = zzimRepository.findByCourseIdAndUserId(testCourse.getId(), testUser.getId()).orElse(null);
        assertThat(zzim).isNull();
    }

    @Test
    @DisplayName("unzzimCourse - not zzimed")
    void unzzimCourse_notZzimed() {
        // when & then
        assertThrows(IllegalArgumentException.class,
                () -> zzimManagementService.unzzimCourse(testCourse.getId(), testUser.getEmail()));
    }
}
