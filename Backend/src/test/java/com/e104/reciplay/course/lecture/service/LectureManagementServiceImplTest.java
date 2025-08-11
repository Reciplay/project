package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureUpdateRequest;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.repository.InstructorRepository;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;


@SpringBootTest
@Transactional
@ActiveProfiles("test")
class LectureManagementServiceImplTest {

    @Autowired
    private LectureManagementService lectureManagementService;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User instructorUser;
    private User otherUser;
    private Instructor instructor;
    private Course course;
    private Lecture lecture;

    @BeforeEach
    void setUp() {
        // 테스트용 강사 유저 생성 및 저장
        instructorUser = User.builder()
                .nickname("testInstructor")
                .role("ROLE_INSTRUCTOR")
                .email("instructor@test.com")
                .password("password")
                .build();
        userRepository.save(instructorUser);

        otherUser = User.builder()
                .nickname("otherUser")
                .role("ROLE_INSTRUCTOR")
                .email("other@test.com")
                .password("password")
                .build();
        userRepository.save(otherUser);

        // 테스트용 강사 생성 및 저장
        instructor = Instructor.builder()
                .userId(instructorUser.getId())
                .isApproved(true)
                .build();
        instructorRepository.save(instructor);

        // 테스트용 강좌 생성 및 저장
        course = Course.builder()
                .instructorId(instructorUser.getId())
                .title("테스트 강좌")
                .isApproved(true)
                .isDeleted(false)
                .build();
        courseRepository.save(course);

        // 테스트용 강의 생성 및 저장
        lecture = Lecture.builder()
                .courseId(course.getId())
                .title("테스트 강의 1")
                .summary("기존 요약")
                .materials("기존 준비물")
                .sequence(1)
                .isSkipped(false)
                .build();
        lectureRepository.save(lecture);
    }

    @Test
    @DisplayName("강의 스킵 상태 변경 성공 테스트")
    void updateSkipStatus_성공() {
        // given
        boolean newSkipStatus = true;

        // when
        lectureManagementService.updateSkipStatus(lecture.getId(), newSkipStatus, instructorUser.getEmail());

        // then
        Lecture updatedLecture = lectureRepository.findById(lecture.getId()).orElseThrow();
        assertThat(updatedLecture.getIsSkipped()).isEqualTo(newSkipStatus);
    }

    @Test
    @DisplayName("강의 스킵 상태 변경 실패 테스트 - 권한 없는 사용자")
    void updateSkipStatus_실패_권한없음() {
        // given
        boolean newSkipStatus = true;

        // when & then
        assertThrows(InvalidUserRoleException.class, () -> {
            lectureManagementService.updateSkipStatus(lecture.getId(), newSkipStatus, otherUser.getEmail());
        });
    }

    @Test
    @DisplayName("강의 등록 성공 테스트")
    void registerLectures_성공() {
        // given
        List<LectureRequest> requests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList(); // Create empty list for chapters
        LectureRegisterRequest request1 = new LectureRegisterRequest("새 강의 1", "요약1", 1, "준비물1", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters);
        LectureRegisterRequest request2 = new LectureRegisterRequest("새 강의 2", "요약2", 2, "준비물2", LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(1), chapters);

        MockMultipartFile file1 = new MockMultipartFile("material", "test1.txt", "text/plain", "test data 1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("material", "test2.txt", "text/plain", "test data 2".getBytes());

        requests.add(new LectureRequest(request1, file1));
        requests.add(new LectureRequest(request2, file2));

        // when
        lectureManagementService.registerLectures(requests, course.getId(), instructorUser.getEmail());

        // then
        List<Lecture> lectures = lectureRepository.findByCourseId(course.getId());
        assertThat(lectures.size()).isEqualTo(3); // 기존 1개 + 새로운 2개
        assertThat(lectures).extracting(Lecture::getTitle).contains("새 강의 1", "새 강의 2");
    }

    @Test
    @DisplayName("강의 등록 실패 테스트 - 순서 불일치")
    void registerLectures_실패_순서불일치() {
        // given
        List<LectureRequest> requests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList();
        LectureRegisterRequest request1 = new LectureRegisterRequest("새 강의 1", "요약1", 1, "준비물1", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters);
        LectureRegisterRequest request2 = new LectureRegisterRequest("새 강의 2", "요약2", 1, "준비물2",  LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(1), chapters);
        requests.add(new LectureRequest(request1, null));
        requests.add(new LectureRequest(request2, null));

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            lectureManagementService.registerLectures(requests, course.getId(), instructorUser.getEmail());
        });
    }

    @Test
    @DisplayName("강의 업데이트 성공 테스트")
    void updateLecture_성공() throws IOException {
        // given
        List<LectureRequest> requests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList();
        // 기존 강의 업데이트
        LectureUpdateRequest updateRequest = new LectureUpdateRequest(lecture.getId(), "업데이트된 강의", "업데이트된 요약", 1, "업데이트된 준비물", lecture.getStartedAt(), lecture.getEndedAt(), chapters);
        MockMultipartFile updateFile = new MockMultipartFile("material", "update.txt", "text/plain", "updated data".getBytes());
        requests.add(new LectureRequest(updateRequest, updateFile));

        // 새 강의 추가
        LectureUpdateRequest newRequest = new LectureUpdateRequest(null, "추가된 강의", "추가된 요약", 2, "추가된 준비물", LocalDateTime.now().plusDays(2), LocalDateTime.now().plusDays(2).plusHours(1), chapters);
        MockMultipartFile newFile = new MockMultipartFile("material", "new.txt", "text/plain", "new data".getBytes());
        requests.add(new LectureRequest(newRequest, newFile));


        // when
        lectureManagementService.updateLecture(requests, course.getId(), instructorUser.getEmail());

        // then
        Lecture updatedLecture = lectureRepository.findById(lecture.getId()).orElseThrow();
        assertThat(updatedLecture.getTitle()).isEqualTo("업데이트된 강의");
        assertThat(updatedLecture.getSummary()).isEqualTo("업데이트된 요약");

        List<Lecture> lectures = lectureRepository.findByCourseId(course.getId());
        assertThat(lectures.size()).isEqualTo(2); // 기존 1개 업데이트 + 새로운 1개 추가
        assertThat(lectures).extracting(Lecture::getTitle).contains("업데이트된 강의", "추가된 강의");
    }

    @Test
    @DisplayName("강의 정보와 자료 그룹화 성공 테스트")
    void groupLectureAndMaterial_성공() {
        // given
        MockMultipartHttpServletRequest multipartRequest = new MockMultipartHttpServletRequest();
        List<LectureControlRequest> lectureRequests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList();

        lectureRequests.add(new LectureRegisterRequest("강의 1", "요약 1", 1, "준비물 1", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters));
        lectureRequests.add(new LectureRegisterRequest("강의 2", "요약 2", 2, "준비물 2", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters));

        MockMultipartFile file1 = new MockMultipartFile("material/0", "test1.txt", "text/plain", "test data 1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("material/1", "test2.txt", "text/plain", "test data 2".getBytes());
        multipartRequest.addFile(file1);
        multipartRequest.addFile(file2);

        // when
        List<LectureRequest> result = lectureManagementService.groupLectureAndMaterial(lectureRequests, multipartRequest);

        // then
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0).getMaterial().getOriginalFilename()).isEqualTo("test1.txt");
        assertThat(result.get(1).getMaterial().getOriginalFilename()).isEqualTo("test2.txt");
        assertThat(result.get(0).getRequest().getTitle()).isEqualTo("강의 1");
    }

    @Test
    @DisplayName("강의 정보와 자료 그룹화 실패 테스트 - 잘못된 파트 이름")
    void groupLectureAndMaterial_실패_잘못된_파트이름() {
        // given
        MockMultipartHttpServletRequest multipartRequest = new MockMultipartHttpServletRequest();
        List<LectureControlRequest> lectureRequests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList();
        lectureRequests.add(new LectureRegisterRequest("강의 1", "요약 1", 1,"준비물 1", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters));
        multipartRequest.addFile(new MockMultipartFile("invalid-name", "test.txt", "text/plain", "test".getBytes()));

        // when & then
        // "material/"로 시작하지 않는 파일은 무시되므로 예외가 발생하지 않고, 해당 파일은 결과에 포함되지 않음
        List<LectureRequest> result = lectureManagementService.groupLectureAndMaterial(lectureRequests, multipartRequest);
        assertThat(result.get(0).getMaterial()).isNull();
    }

    @Test
    @DisplayName("강의 정보와 자료 그룹화 실패 테스트 - 잘못된 인덱스 형식")
    void groupLectureAndMaterial_실패_잘못된_인덱스() {
        // given
        MockMultipartHttpServletRequest multipartRequest = new MockMultipartHttpServletRequest();
        List<LectureControlRequest> lectureRequests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList();
        lectureRequests.add(new LectureRegisterRequest("강의 1", "요약 1", 1, "준비물 1", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters));
        multipartRequest.addFile(new MockMultipartFile("material/abc", "test.txt", "text/plain", "test".getBytes()));

        // when & then
        assertThrows(NumberFormatException.class, () -> {
            lectureManagementService.groupLectureAndMaterial(lectureRequests, multipartRequest);
        });
    }


    @Test
    @DisplayName("강의 정보와 자료 그룹화 실패 테스트 - 중복된 강의 자료")
    void groupLectureAndMaterial_실패_중복된_자료() {
        // given
        MockMultipartHttpServletRequest multipartRequest = new MockMultipartHttpServletRequest();
        List<LectureControlRequest> lectureRequests = new ArrayList<>();
        List<ChapterItem> chapters = Collections.emptyList();
        lectureRequests.add(new LectureRegisterRequest("강의 1", "요약 1", 1, "준비물 1", LocalDateTime.now(), LocalDateTime.now().plusHours(1), chapters));

        multipartRequest.addFile(new MockMultipartFile("material/0", "test1.txt", "text/plain", "test".getBytes()));
        multipartRequest.addFile(new MockMultipartFile("material/0", "test2.txt", "text/plain", "test".getBytes()));

        // when & then
        assertThrows(IllegalArgumentException.class, () -> {
            lectureManagementService.groupLectureAndMaterial(lectureRequests, multipartRequest);
        });
    }
}
