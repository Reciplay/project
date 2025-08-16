package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.admin.repository.MessageRepository;
import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.courses.repository.CanLearnRepository;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.*;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AdCourseManagementServiceIntegrationTest {

    @Autowired
    private AdCourseManagementService adCourseManagementService;

    @Autowired
    private EntityManager entityManager;

    // Repositories for data setup and verification
    @Autowired private UserRepository userRepository;
    @Autowired private InstructorRepository instructorRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private LectureRepository lectureRepository;
    @Autowired private ChapterRepository chapterRepository;
    @Autowired private TodoRepository todoRepository;
    @Autowired private CanLearnRepository canLearnRepository;
    @Autowired private MessageRepository messageRepository;

    private User admin, instructorUser;
    private Instructor instructor;
    private Course course;
    private Lecture lecture;
    private Chapter chapter;

    @BeforeEach
    void setUp() {
        // 1. 관리자, 강사 유저 생성
        admin = userRepository.save(User.builder().name("admin").email("admin@test.com").role("ROLE_ADMIN").build());
        instructorUser = userRepository.save(User.builder().name("inst").email("instructor@test.mail").role("ROLE_INSTRUCTOR").build());

        // 2. 강사 생성
        instructor = instructorRepository.save(Instructor.builder().userId(instructorUser.getId()).build());

        // 3. 강좌 생성 (심사 대기 상태)
        course = Course.builder().title("Test Course").description("desc").maxEnrollments(10).isApproved(false).instructorId(instructor.getId()).level(10).build();
        course = courseRepository.save(course);

        // 4. 강의 생성
        lecture = lectureRepository.save(Lecture.builder().courseId(course.getId()).title("TestLecture").courseId(course.getId()).isSkipped(false).build());

        // 5. 챕터 생성
        chapter = chapterRepository.save(Chapter.builder().title("Chapter 1").sequence(1).lectureId(lecture.getId()).build());

        // 6. 투두리스트, 배울 점 생성
        todoRepository.save(Todo.builder().chapterId(chapter.getId()).title("Todo 1").type(TodoType.NORMAL).build());
        canLearnRepository.save(CanLearn.builder().courseId(course.getId()).content("볶음").build());

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    @DisplayName("강좌 등록 거절 통합 테스트 - 관련 데이터 삭제 및 메시지 생성")
    void rejectCourseApprovalIntegrationTest() {
        // given
        long initialMessageCount = messageRepository.count();
        ApprovalInfo approvalInfo = new ApprovalInfo("거절되었습니다", false, course.getId(), instructor.getId());

        // when
        adCourseManagementService.updateCourseApproval(approvalInfo, admin.getId());

        entityManager.flush();
        entityManager.clear();

        // then
        // 1. 강좌 및 하위 데이터가 모두 삭제되었는지 확인
        assertFalse(courseRepository.findById(course.getId()).isPresent(), "강좌가 삭제되어야 합니다.");
        assertTrue(lectureRepository.findByCourseId(course.getId()).isEmpty(), "강의가 삭제되어야 합니다.");
        assertTrue(chapterRepository.findByLectureId(lecture.getId()).isEmpty(), "챕터가 삭제되어야 합니다.");
        assertTrue(todoRepository.findByChapterId(chapter.getId()).isEmpty(), "투두가 삭제되어야 합니다.");
        assertTrue(canLearnRepository.findContentsByCourseId(course.getId()).isEmpty(), "배울 점이 삭제되어야 합니다.");

        // 2. 거절 알림 메시지가 생성되었는지 확인
        assertEquals(initialMessageCount + 1, messageRepository.count(), "메시지가 1개 생성되어야 합니다.");
        List<Message> messages = messageRepository.findAll();
        Message latestMessage = messages.get(messages.size() - 1);

        assertEquals(admin.getId(), latestMessage.getSenderId(), "발신자는 관리자여야 합니다.");
        assertEquals(instructorUser.getId(), latestMessage.getReceiverId(), "수신자는 강사여야 합니다.");
        assertTrue(latestMessage.getContent().contains("거절되었습니다"), "거절 메시지가 포함되어야 합니다.");
        assertTrue(latestMessage.getContent().contains(approvalInfo.getMessage()), "거절 사유가 포함되어야 합니다.");
    }
}
