package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.LectureSummary;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.repository.*;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.e104.reciplay.s3.repository.FileMetadataRepository;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class LectureQueryServiceImplTest {

    @Autowired
    private LectureQueryService lectureQueryService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LectureRepository lectureRepository;
    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private LectureHistoryRepository lectureHistoryRepository;
    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @MockitoBean
    private S3Service s3Service;
    @MockitoBean
    private FileMetadataQueryService fileMetadataQueryService;

    private User student;
    private Course course;
    private Lecture lecture1, lecture2;
    private Chapter chapter1, chapter2;
    private FileMetadata fileMetadata;

    @BeforeEach
    void setUp() {
        // 사용자, 강사, 강좌, 강의, 챕터, 할일, 수강기록, 파일메타데이터 등 테스트 데이터 설정
        User instructorUser = userRepository.save(User.builder().nickname("강사").email("instructor@test.com").role("ROLE_INSTRUCTOR").build());
        student = userRepository.save(User.builder().nickname("학생").email("student@test.com").role("ROLE_STUDENT").build());

        Instructor instructor = instructorRepository.save(Instructor.builder().userId(instructorUser.getId()).isApproved(true).build());
        course = courseRepository.save(Course.builder().instructorId(instructor.getId()).title("테스트 강좌").build());

        lecture1 = lectureRepository.save(Lecture.builder().courseId(course.getId()).title("강의 1").summary("요약 1").sequence(1).build());
        lecture2 = lectureRepository.save(Lecture.builder().courseId(course.getId()).title("강의 2").summary("요약 2").sequence(2).build());

        chapter1 = chapterRepository.save(Chapter.builder().lectureId(lecture1.getId()).title("챕터 1-1").sequence(1).build());
        chapter2 = chapterRepository.save(Chapter.builder().lectureId(lecture1.getId()).title("챕터 1-2").sequence(2).build());

        todoRepository.save(Todo.builder().chapterId(chapter1.getId()).title("할일 1").sequence(1).type(TodoType.TIMER).seconds(60).build());
        todoRepository.save(Todo.builder().chapterId(chapter1.getId()).title("할일 2").sequence(2).type(TodoType.NORMAL).build());

        lectureHistoryRepository.save(LectureHistory.builder().userId(student.getId()).lectureId(lecture1.getId()).build());

        fileMetadata = fileMetadataRepository.save(FileMetadata.builder().relatedId(lecture1.getId()).relatedType(RelatedType.LECTURE).category(FileCategory.MATERIALS).name("강의자료.pdf").build());
    }

    @Test
    @DisplayName("강좌의 강의 요약 목록 조회 성공")
    void 강좌의_강의_요약_목록_조회_성공() {
        // when
        List<LectureSummary> summaries = lectureQueryService.queryLectureSummaries(course.getId());

        // then
        assertThat(summaries).hasSize(2);
        assertThat(summaries.get(0).getTitle()).isEqualTo(lecture1.getTitle());
        assertThat(summaries.get(1).getTitle()).isEqualTo(lecture2.getTitle());
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = "USER")
    @DisplayName("강의 상세 조회 성공 (수강 이력 있음)")
    void 강의_상세_조회_성공_수강이력_있음() {
        // given
        given(fileMetadataQueryService.queryLectureMaterial(lecture1.getId())).willReturn(fileMetadata);
        given(s3Service.getResponseFileInfo(any(FileMetadata.class))).willReturn(new ResponseFileInfo("http://s3.url/lecture1/강의자료.pdf", "강의자료.pdf", 1));

        // when
        LectureDetail detail = lectureQueryService.queryLectureDetail(lecture1.getId());

        // then
        assertThat(detail).isNotNull();
        assertThat(detail.getTitle()).isEqualTo(lecture1.getTitle());
        assertThat(detail.getChapters()).hasSize(2);
        assertThat(detail.getChapters().get(0).getTodos()).hasSize(2);
        assertThat(detail.getChapters().get(0).getTitle()).isEqualTo(chapter1.getTitle());
        assertThat(detail.isTaken()).isTrue();
        assertThat(detail.getLectureMaterial()).isNotNull();
        assertThat(detail.getLectureMaterial().getName()).isEqualTo("강의자료.pdf");
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = "USER")
    @DisplayName("강의 상세 조회 성공 (수강 이력 없음)")
    void 강의_상세_조회_성공_수강이력_없음() {
        // given
        given(fileMetadataQueryService.queryLectureMaterial(lecture2.getId())).willThrow(new RuntimeException("No file metadata"));

        // when
        LectureDetail detail = lectureQueryService.queryLectureDetail(lecture2.getId());

        // then
        assertThat(detail).isNotNull();
        assertThat(detail.getTitle()).isEqualTo(lecture2.getTitle());
        assertThat(detail.isTaken()).isFalse();
        assertThat(detail.getLectureMaterial()).isNull();
    }

    @Test
    @DisplayName("강의 상세 조회 실패 (존재하지 않는 강의)")
    void 강의_상세_조회_실패_존재하지_않는_강의() {
        // given
        Long nonExistentLectureId = 999L;

        // when & then
        assertThrows(LectureNotFoundException.class, () -> {
            lectureQueryService.queryLectureDetail(nonExistentLectureId);
        });
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = "USER")
    @DisplayName("강좌의 모든 강의 상세 목록 조회 성공")
    void 강좌의_모든_강의_상세_목록_조회_성공() {
        // given
        given(fileMetadataQueryService.queryLectureMaterial(lecture1.getId())).willReturn(fileMetadata);
        given(s3Service.getResponseFileInfo(any(FileMetadata.class))).willReturn(new ResponseFileInfo("http://s3.url/lecture1/강의자료.pdf", "강의자료.pdf", 1));
        given(fileMetadataQueryService.queryLectureMaterial(lecture2.getId())).willThrow(new RuntimeException("No file metadata"));

        // when
        List<LectureDetail> details = lectureQueryService.queryLectureDetails(course.getId());

        // then
        assertThat(details).hasSize(2);

        LectureDetail detail1 = details.stream().filter(d -> d.getLectureId().equals(lecture1.getId())).findFirst().orElseThrow();
        assertThat(detail1.isTaken()).isTrue();
        assertThat(detail1.getLectureMaterial()).isNotNull();
        assertThat(detail1.getChapters()).hasSize(2);

        LectureDetail detail2 = details.stream().filter(d -> d.getLectureId().equals(lecture2.getId())).findFirst().orElseThrow();
        assertThat(detail2.isTaken()).isFalse();
        assertThat(detail2.getLectureMaterial()).isNull();
    }
}
